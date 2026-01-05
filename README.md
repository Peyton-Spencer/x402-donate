# x402 Donate

A donation page powered by [x402](https://x402.org) for accepting crypto payments on Base.

## Getting Started

### Prerequisites

1. **Reown Project ID** (required for wallet connection)
   - Go to [Reown Cloud](https://cloud.reown.com/) and create a project
   - Copy your Project ID

2. Create a `.env` file in the project root:
   ```bash
   VITE_REOWN_PROJECT_ID=your_project_id_here
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
3. Supporters can donate USDC on Base or Base Sepolia

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
