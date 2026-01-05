import { createFormHook } from "@tanstack/react-form";
import {
	AmountField,
	DonateButton,
	MessageField,
	NetworkField,
} from "@/components/DonationFormComponents";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm: useDonationForm } = createFormHook({
	fieldComponents: {
		AmountField,
		MessageField,
		NetworkField,
	},
	formComponents: {
		DonateButton,
	},
	fieldContext,
	formContext,
});
