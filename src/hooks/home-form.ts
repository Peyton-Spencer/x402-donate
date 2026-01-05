import { createFormHook } from "@tanstack/react-form";
import {
	GoToButton,
	LinkPreview,
	RecipientField,
	ValidationHint,
} from "@/components/HomeFormComponents";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm: useHomeForm } = createFormHook({
	fieldComponents: {
		RecipientField,
	},
	formComponents: {
		GoToButton,
		LinkPreview,
		ValidationHint,
	},
	fieldContext,
	formContext,
});
