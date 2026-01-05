import type { AppKitNetwork } from "@reown/appkit/networks";
import { base, baseSepolia, mainnet, sepolia } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { cookieStorage, createStorage, http } from "@wagmi/core";

// Get a project ID at https://cloud.reown.com
export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || "demo";

if (!projectId || projectId === "demo") {
	console.warn(
		"VITE_REOWN_PROJECT_ID not set. Wallet connections may not work properly.",
	);
}

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
	baseSepolia,
	base,
	sepolia,
	mainnet,
];

export const wagmiAdapter = new WagmiAdapter({
	storage: createStorage({
		storage: cookieStorage,
	}),
	ssr: true,
	projectId,
	networks,
	transports: {
		[baseSepolia.id]: http(),
		[base.id]: http(),
		[sepolia.id]: http(),
		[mainnet.id]: http(),
	},
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;

// Network mapping for UI
export const SUPPORTED_NETWORKS = {
	"base-sepolia": {
		id: baseSepolia.id,
		name: "Base Sepolia",
		chainId: "eip155:84532",
		asset: "USDC",
		assetAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as `0x${string}`,
		assetDecimals: 6,
		isTestnet: true,
	},
	base: {
		id: base.id,
		name: "Base",
		chainId: "eip155:8453",
		asset: "USDC",
		assetAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`,
		assetDecimals: 6,
		isTestnet: false,
	},
	sepolia: {
		id: sepolia.id,
		name: "Sepolia",
		chainId: "eip155:11155111",
		asset: "USDC",
		assetAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as `0x${string}`,
		assetDecimals: 6,
		isTestnet: true,
	},
	mainnet: {
		id: mainnet.id,
		name: "Ethereum",
		chainId: "eip155:1",
		asset: "USDC",
		assetAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`,
		assetDecimals: 6,
		isTestnet: false,
	},
} as const;

export type NetworkKey = keyof typeof SUPPORTED_NETWORKS;
