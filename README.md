# x402 Donate

A donation page powered by [x402](https://x402.org) for accepting crypto payments via USDC.

## Getting Started

### Prerequisites

1. **Reown Project ID** (required for wallet connection)
   - Go to [Reown Cloud](https://cloud.reown.com/) and create a project
   - Copy your Project ID

2. **Facilitator URL** (required for payment settlement)
   - Default: `https://x402.org/facilitator`

### Environment Variables

Create a `.env` file in the project root:

```bash
# Required: Reown Project ID for wallet connection
VITE_REOWN_PROJECT_ID=your_project_id_here

# Facilitator URL for payment verification and settlement (has default)
FACILITATOR_URL=https://x402.org/facilitator

# Optional: App creator wallet for "Support the creator" links
# Supports ENS names (e.g., yourname.eth) or raw addresses (0x...)
VITE_CREATOR_ADDRESS=
```

### Installation

```bash
bun install
bun run dev
```

### Building For Production

```bash
bun run build
```

## Usage

1. Visit the home page and enter an Ethereum address or ENS name
2. Share the generated donation link with supporters
3. Supporters can donate USDC on any supported network

### How x402 Payments Work

1. User selects amount and network, clicks donate
2. App returns HTTP 402 with payment requirements
3. User signs a `TransferWithAuthorization` (ERC-3009) in their wallet
4. Signature is sent to the facilitator for verification
5. Facilitator settles the payment on-chain
6. User sees success with transaction hash

### App Creator Support

Set `VITE_CREATOR_ADDRESS` to show "Support the app creator" links throughout the app. This provides a non-intrusive way to monetize the app by encouraging donations.

## Tech Stack

- [TanStack Start](https://tanstack.com/start) - Full-stack React framework
- [x402](https://x402.org) - HTTP 402 payment protocol
- [Reown AppKit](https://reown.com/) - Wallet connection
- [wagmi](https://wagmi.sh/) - React hooks for Ethereum
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## Development

### Linting & Formatting

This project uses [Biome](https://biomejs.dev/):

```bash
bun run lint
bun run format
bun run check
```

### Testing

```bash
bun run test
```
