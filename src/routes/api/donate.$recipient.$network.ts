import { createFileRoute } from "@tanstack/react-router";

// x402 v2 payment requirements format
interface PaymentRequirement {
	scheme: string;
	network: string;
	amount: string; // Amount in smallest unit (e.g., 6 decimals for USDC)
	resource: string;
	description: string;
	mimeType: string;
	payTo: string;
	maxTimeoutSeconds: number;
	asset: string;
	extra?: Record<string, unknown>;
}

const NETWORK_CONFIG: Record<
	string,
	{
		chainId: number;
		chainIdCAIP: string;
		asset: string;
		name: string;
		eip712: { name: string; version: string };
	}
> = {
	"base-sepolia": {
		chainId: 84532,
		chainIdCAIP: "eip155:84532",
		asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC on Base Sepolia
		name: "Base Sepolia",
		eip712: { name: "USDC", version: "2" },
	},
	base: {
		chainId: 8453,
		chainIdCAIP: "eip155:8453",
		asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
		name: "Base",
		eip712: { name: "USD Coin", version: "2" },
	},
};

/**
 * Build x402 v2 payment requirements for a donation
 */
function buildPaymentRequirements(
	recipient: string,
	network: string,
	amountCents: number,
	resourceUrl: string,
): PaymentRequirement[] {
	const networkConfig = NETWORK_CONFIG[network];
	if (!networkConfig) {
		throw new Error("Unsupported network");
	}

	// Convert cents to USDC (6 decimals): $3.00 = 300 cents = 3000000 USDC units
	const amountInUsdcUnits = (amountCents * 10000).toString();
	const priceInDollars = (amountCents / 100).toFixed(2);

	return [
		{
			scheme: "exact",
			network: networkConfig.chainIdCAIP,
			amount: amountInUsdcUnits,
			resource: resourceUrl,
			description: `Donation of $${priceInDollars} to ${recipient}`,
			mimeType: "application/json",
			payTo: recipient,
			maxTimeoutSeconds: 300,
			asset: networkConfig.asset,
			extra: {
				name: networkConfig.eip712.name,
				version: networkConfig.eip712.version,
			},
		},
	];
}

/**
 * Create a 402 Payment Required response with x402 v2 format
 */
function createPaymentRequiredResponse(
	paymentRequirements: PaymentRequirement[],
): Response {
	const paymentRequired = {
		x402Version: 2 as const,
		accepts: paymentRequirements,
		error: "Payment Required",
	};

	const encodedPaymentRequired = btoa(JSON.stringify(paymentRequired));

	return new Response(JSON.stringify({ error: "Payment Required" }), {
		status: 402,
		headers: {
			"Content-Type": "application/json",
			"PAYMENT-REQUIRED": encodedPaymentRequired,
		},
	});
}

export const Route = createFileRoute("/api/donate/$recipient/$network")({
	server: {
		handlers: {
			// GET returns 402 with payment requirements
			GET: async ({ request, params }) => {
				const { recipient, network } = params;
				const url = new URL(request.url);
				const amountCents = Number.parseInt(
					url.searchParams.get("amount") || "100",
					10,
				);

				// Validate recipient address
				if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
					return Response.json(
						{ error: "Invalid recipient address" },
						{ status: 400 },
					);
				}

				// Validate network
				if (!NETWORK_CONFIG[network]) {
					return Response.json(
						{ error: "Unsupported network" },
						{ status: 400 },
					);
				}

				// Validate amount
				if (amountCents < 1) {
					return Response.json({ error: "Invalid amount" }, { status: 400 });
				}

				const paymentRequirements = buildPaymentRequirements(
					recipient,
					network,
					amountCents,
					request.url,
				);
				return createPaymentRequiredResponse(paymentRequirements);
			},

			// POST handles the payment verification and success
			POST: async ({ request, params }) => {
				const { recipient, network } = params;

				// Check for payment header (x402 payment proof)
				// v2 uses PAYMENT-SIGNATURE, v1 uses X-Payment
				const paymentHeader =
					request.headers.get("PAYMENT-SIGNATURE") ||
					request.headers.get("X-Payment");

				if (!paymentHeader) {
					// No payment provided, return 402
					const url = new URL(request.url);
					const amountCents = Number.parseInt(
						url.searchParams.get("amount") || "100",
						10,
					);

					if (!NETWORK_CONFIG[network]) {
						return Response.json(
							{ error: "Unsupported network" },
							{ status: 400 },
						);
					}

					const paymentRequirements = buildPaymentRequirements(
						recipient,
						network,
						amountCents,
						request.url,
					);
					return createPaymentRequiredResponse(paymentRequirements);
				}

				// Payment header exists - in a full implementation, you would:
				// 1. Verify the payment with the facilitator
				// 2. Check that the payment matches the requirements
				// For this POC, we'll trust that the x402 client handled it correctly

				try {
					// Parse the payment to get transaction details
					// v2 format is base64 encoded, try to decode first
					let payment: Record<string, unknown>;
					try {
						// Try base64 decode first (v2 format)
						const decoded = atob(paymentHeader);
						payment = JSON.parse(decoded);
					} catch {
						// Fall back to direct JSON parse (v1 format)
						payment = JSON.parse(paymentHeader);
					}

					console.log("Donation received!", {
						recipient,
						network,
						payment,
					});

					// Return success response
					return Response.json({
						success: true,
						message: "Thank you for your donation! ☕",
						recipient,
						network,
						txHash:
							payment.txHash ||
							(payment.transaction as { hash?: string })?.hash,
					});
				} catch (err) {
					console.error("Payment verification error:", err);
					return Response.json(
						{ error: "Invalid payment format" },
						{ status: 400 },
					);
				}
			},
		},
	},
});
