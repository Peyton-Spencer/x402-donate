"use client";

import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { type State, WagmiProvider } from "wagmi";
import { networks, projectId, wagmiAdapter } from "./wagmi-config";

// Create query client
const queryClient = new QueryClient();

// Set up metadata
const metadata = {
	name: "Buy Me a Coffee",
	description: "Donate crypto to your favorite creators",
	url:
		typeof window !== "undefined" ? window.location.origin : "https://x402.org",
	icons: ["https://x402.org/icon.png"],
};

// Create the modal - only on client
if (typeof window !== "undefined") {
	createAppKit({
		adapters: [wagmiAdapter],
		projectId,
		networks,
		metadata,
		themeMode: "dark",
		features: {
			analytics: false,
		},
	});
}

export function AppKitProvider({
	children,
	initialState,
}: {
	children: ReactNode;
	initialState?: State;
}) {
	return (
		<WagmiProvider
			config={wagmiAdapter.wagmiConfig}
			initialState={initialState}
		>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	);
}
