import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";

// Public client for ENS resolution (ENS is on mainnet)
const mainnetClient = createPublicClient({
	chain: mainnet,
	transport: http(),
});

/**
 * Check if a string looks like an ENS name
 */
export function isEnsName(value: string): boolean {
	return /^[a-zA-Z0-9-]+\.eth$/.test(value);
}

/**
 * Check if a string is a valid Ethereum address
 */
export function isAddress(value: string): value is `0x${string}` {
	return /^0x[a-fA-F0-9]{40}$/.test(value);
}

/**
 * Resolve an ENS name to an address
 * Returns null if the name cannot be resolved
 */
export async function resolveEnsName(
	name: string,
): Promise<`0x${string}` | null> {
	try {
		const normalizedName = normalize(name);
		const address = await mainnetClient.getEnsAddress({
			name: normalizedName,
		});
		return address;
	} catch (error) {
		console.error("ENS resolution failed:", error);
		return null;
	}
}

/**
 * Get ENS name for an address (reverse lookup)
 * Returns null if no ENS name is set
 */
export async function getEnsName(
	address: `0x${string}`,
): Promise<string | null> {
	try {
		const name = await mainnetClient.getEnsName({
			address,
		});
		return name;
	} catch (error) {
		console.error("ENS reverse lookup failed:", error);
		return null;
	}
}
