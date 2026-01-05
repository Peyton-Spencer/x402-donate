import { useStore } from "@tanstack/react-form";
import { ChevronDown, Heart, Loader2, Wallet } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFieldContext, useFormContext } from "@/hooks/form-context";
import { type NetworkKey, SUPPORTED_NETWORKS } from "@/lib/wagmi-config";

const PRESET_AMOUNTS = [
	{ value: 100, label: "$1", coffees: 1 },
	{ value: 300, label: "$3", coffees: 2 },
	{ value: 500, label: "$5", coffees: 3 },
	{ value: 1000, label: "$10", coffees: 5 },
];

export function AmountField() {
	const field = useFieldContext<number>();
	const [customAmount, setCustomAmount] = useState<string>("");
	const [isCustom, setIsCustom] = useState(false);

	const handlePresetClick = (value: number) => {
		field.handleChange(value);
		setIsCustom(false);
		setCustomAmount("");
	};

	const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
			setCustomAmount(value);
			setIsCustom(true);
			const cents = Math.round(Number.parseFloat(value || "0") * 100);
			field.handleChange(cents);
		}
	};

	return (
		<div className="mb-6">
			<span className="text-sm font-medium text-zinc-300 block mb-3">
				Choose amount
			</span>
			<div className="grid grid-cols-4 gap-2 mb-3">
				{PRESET_AMOUNTS.map(({ value, label, coffees }) => (
					<button
						type="button"
						key={value}
						onClick={() => handlePresetClick(value)}
						className={`
							relative py-3 px-2 rounded-xl font-semibold text-sm transition-all duration-200
							${
								!isCustom && field.state.value === value
									? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 scale-105"
									: "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 border border-zinc-700/50"
							}
						`}
					>
						<span className="block">{label}</span>
						<span className="text-xs opacity-70">
							{"☕".repeat(Math.min(coffees, 3))}
							{coffees > 3 && "+"}
						</span>
					</button>
				))}
			</div>

			{/* Custom amount */}
			<div className="relative">
				<span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-semibold">
					$
				</span>
				<Input
					type="text"
					inputMode="decimal"
					placeholder="Custom amount"
					value={customAmount}
					onChange={handleCustomAmountChange}
					onFocus={() => setIsCustom(true)}
					onBlur={field.handleBlur}
					className={`
						pl-8 h-12 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-500
						focus:border-amber-500 focus:ring-amber-500/20 rounded-xl
						${isCustom && customAmount ? "border-amber-500 ring-2 ring-amber-500/20" : ""}
					`}
				/>
			</div>
		</div>
	);
}

export function NetworkField() {
	const field = useFieldContext<NetworkKey>();
	const [showDropdown, setShowDropdown] = useState(false);
	const networkInfo = SUPPORTED_NETWORKS[field.state.value];

	const handleNetworkSelect = (network: NetworkKey) => {
		field.handleChange(network);
		setShowDropdown(false);
	};

	return (
		<div className="mb-6">
			<span className="text-sm font-medium text-zinc-300 block mb-2">
				Network
			</span>
			<div className="relative">
				<button
					type="button"
					onClick={() => setShowDropdown(!showDropdown)}
					onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
					className="w-full flex items-center justify-between px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white hover:bg-zinc-700/50 transition-colors"
				>
					<div className="flex items-center gap-2">
						<div
							className={`w-2 h-2 rounded-full ${networkInfo.isTestnet ? "bg-yellow-400" : "bg-green-400"}`}
						/>
						<span>{networkInfo.name}</span>
						{networkInfo.isTestnet && (
							<span className="text-xs text-yellow-400/70 bg-yellow-400/10 px-1.5 py-0.5 rounded">
								Testnet
							</span>
						)}
					</div>
					<ChevronDown
						className={`w-4 h-4 text-zinc-400 transition-transform ${showDropdown ? "rotate-180" : ""}`}
					/>
				</button>

				{showDropdown && (
					<div className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden z-20 shadow-xl">
						{(Object.keys(SUPPORTED_NETWORKS) as NetworkKey[]).map((key) => {
							const net = SUPPORTED_NETWORKS[key];
							return (
								<button
									type="button"
									key={key}
									onClick={() => handleNetworkSelect(key)}
									className={`w-full flex items-center gap-2 px-4 py-3 hover:bg-zinc-700/50 transition-colors text-left ${
										field.state.value === key
											? "bg-zinc-700/30 text-amber-400"
											: "text-white"
									}`}
								>
									<div
										className={`w-2 h-2 rounded-full ${net.isTestnet ? "bg-yellow-400" : "bg-green-400"}`}
									/>
									<span>{net.name}</span>
									{net.isTestnet && (
										<span className="text-xs text-yellow-400/70 bg-yellow-400/10 px-1.5 py-0.5 rounded">
											Testnet
										</span>
									)}
								</button>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

export function MessageField({ id }: { id: string }) {
	const field = useFieldContext<string>();

	return (
		<div className="mb-6">
			<label
				htmlFor={id}
				className="text-sm font-medium text-zinc-300 block mb-2"
			>
				Add a message{" "}
				<span className="text-zinc-500 font-normal">(optional)</span>
			</label>
			<Input
				id={id}
				type="text"
				placeholder="Thanks for your work!"
				value={field.state.value}
				onChange={(e) => field.handleChange(e.target.value)}
				onBlur={field.handleBlur}
				maxLength={100}
				className="h-12 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/20 rounded-xl"
			/>
		</div>
	);
}

type PaymentStatus =
	| "idle"
	| "connecting"
	| "switching-network"
	| "signing"
	| "processing"
	| "success"
	| "error";

export function DonateButton({
	isConnected,
	status,
	networkName,
}: {
	isConnected: boolean;
	status: PaymentStatus;
	networkName: string;
}) {
	const form = useFormContext();
	const amount = useStore(form.store, (state) => state.values.amount as number);
	const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

	const displayAmount = (amount / 100).toFixed(2);

	return (
		<Button
			type="submit"
			disabled={amount < 1 || isSubmitting || status !== "idle"}
			className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/40 disabled:opacity-50 disabled:hover:scale-100"
		>
			{status === "idle" && !isConnected && (
				<>
					<Wallet className="w-5 h-5 mr-2" />
					Connect & Donate ${displayAmount}
				</>
			)}
			{status === "idle" && isConnected && (
				<>
					<Heart className="w-5 h-5 mr-2" />
					Donate ${displayAmount}
				</>
			)}
			{status === "connecting" && (
				<>
					<Loader2 className="w-5 h-5 mr-2 animate-spin" />
					Connecting wallet...
				</>
			)}
			{status === "switching-network" && (
				<>
					<Loader2 className="w-5 h-5 mr-2 animate-spin" />
					Switching to {networkName}...
				</>
			)}
			{status === "signing" && (
				<>
					<Wallet className="w-5 h-5 mr-2 animate-pulse" />
					Sign in wallet...
				</>
			)}
			{status === "processing" && (
				<>
					<Loader2 className="w-5 h-5 mr-2 animate-spin" />
					Processing x402 payment...
				</>
			)}
		</Button>
	);
}
