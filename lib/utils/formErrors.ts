import { UseFormReturn } from "react-hook-form";

/**
 * Maps standard API error format from lib/api.ts to a react-hook-form instance.
 * @param methods - The react-hook-form instance (from useForm)
 * @param error - The error object thrown by Tanstack Query / Axios
 */
export function setFormErrors(methods: UseFormReturn<any>, error: any) {
    if (!error) return;

    // Handle Laravel validation errors: { email: ["The email field is required."] }
    if (error.errors && typeof error.errors === "object") {
        Object.entries(error.errors).forEach(([field, messages]) => {
            const message = Array.isArray(messages) ? messages[0] : messages;
            methods.setError(field as any, {
                type: "server",
                message: message as string,
            });
        });
    } else if (error.message) {
        // Fallback for general message, can be mapped to root or a specific field if desired
        methods.setError("root.serverError", {
            type: "server",
            message: error.message,
        });
    }
}
