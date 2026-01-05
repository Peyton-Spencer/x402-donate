import { useStore } from "@tanstack/react-form";
import { ArrowRight, Check, Copy } from "lucide-react";
import { useCallback, useId, useState } from "react";
import { useFieldContext, useFormContext } from "@/hooks/form-context";

export function RecipientField() {
	const field = useFieldContext<string>();
	const inputId = useId();

	return (
		<div>
			<label
				htmlFor={inputId}
				className="block text-sm font-medium text-zinc-300 mb-2"
			>
				Recipient Address or ENS
			</label>
			<input
				id={inputId}
				type="text"
				value={field.state.value}
				onChange={(e) => field.handleChange(e.target.value.trim())}
				onBlur={field.handleBlur}
				placeholder="0x... or vitalik.eth"
				className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 font-mono text-sm"
			/>
		</div>
	);
}

// Check if input looks like a valid address or ENS name
function isValidRecipient(input: string): boolean {
	return (
		/^0x[a-fA-F0-9]{40}$/.test(input) || /^[a-zA-Z0-9-]+\.eth$/.test(input)
	);
}

export function LinkPreview() {
	const form = useFormContext();
	const recipient = useStore(
		form.store,
		(state) => state.values.recipient as string,
	);
	const [copied, setCopied] = useState(false);

	const isValid = isValidRecipient(recipient);
	const donateUrl =
		isValid && typeof window !== "undefined"
			? `${window.location.origin}/donate/${recipient}`
			: null;

	const handleCopy = useCallback(async () => {
		if (donateUrl) {
			await navigator.clipboard.writeText(donateUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	}, [donateUrl]);

	if (!isValid || !donateUrl) {
		return null;
	}

	return (
		<div className="p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
			<p className="text-xs text-zinc-400 mb-1">Your payment link</p>
			<div className="flex items-center gap-2">
				<code className="flex-1 text-amber-400 text-sm font-mono truncate">
					{donateUrl}
				</code>
				<button
					type="button"
					onClick={handleCopy}
					className="p-2 hover:bg-zinc-700/50 rounded-lg transition-colors"
					title="Copy link"
				>
					{copied ? (
						<Check className="w-4 h-4 text-green-400" />
					) : (
						<Copy className="w-4 h-4 text-zinc-400" />
					)}
				</button>
			</div>
		</div>
	);
}

export function GoToButton() {
	const form = useFormContext();
	const recipient = useStore(
		form.store,
		(state) => state.values.recipient as string,
	);
	const isValid = isValidRecipient(recipient);

	if (!isValid) {
		return null;
	}

	return (
		<button
			type="submit"
			className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/25"
		>
			Go to payment page
			<ArrowRight className="w-4 h-4" />
		</button>
	);
}

export function ValidationHint() {
	const form = useFormContext();
	const recipient = useStore(
		form.store,
		(state) => state.values.recipient as string,
	);
	const isValid = isValidRecipient(recipient);

	if (isValid || recipient.length === 0) {
		return null;
	}

	return (
		<p className="text-sm text-zinc-500">
			Enter a valid Ethereum address (0x...) or ENS name (.eth)
		</p>
	);
}
