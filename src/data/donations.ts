import { type NetworkKey, SUPPORTED_NETWORKS } from "@/lib/wagmi-config";

export interface DonationPaymentDetails {
	scheme: "exact";
	price: string;
	network: string;
	networkName: string;
	payTo: `0x${string}`;
	asset: string;
	chainId: number;
}

/**
 * Creates payment details for a donation (client-side, no server needed)
 */
export function createPaymentDetails(
	recipient: `0x${string}`,
	amountCents: number,
	network: NetworkKey,
): DonationPaymentDetails {
	const networkConfig = SUPPORTED_NETWORKS[network];
	const priceInDollars = (amountCents / 100).toFixed(2);

	return {
		scheme: "exact",
		price: `$${priceInDollars}`,
		network: networkConfig.chainId,
		networkName: networkConfig.name,
		payTo: recipient,
		asset: networkConfig.asset,
		chainId: networkConfig.id,
	};
}
