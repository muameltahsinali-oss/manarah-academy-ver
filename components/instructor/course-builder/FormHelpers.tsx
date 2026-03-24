import { useFormContext } from "react-hook-form";

export function FormInput({ name, label, placeholder, fontMono }: { name: string, label: string, placeholder: string, fontMono?: boolean }) {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name]?.message as string;

    return (
        <div>
            <label className="block text-sm font-bold text-text mb-2">{label}</label>
            <input
                type="text"
                {...register(name)}
                placeholder={placeholder}
                className={`w-full bg-background border rounded-[4px] px-4 py-3 text-sm focus:outline-none transition-colors ${fontMono ? "font-mono" : ""} ${error ? "border-red-500 focus:border-red-500" : "border-border/80 focus:border-primary"
                    }`}
            />
            {error && <span className="text-xs text-red-500 font-bold block mt-2">{error}</span>}
        </div>
    );
}

export function FormSelect({ name, label, options }: { name: string, label: string, options: string[] }) {
    const { register } = useFormContext();

    return (
        <div>
            <label className="block text-sm font-bold text-text mb-2">{label}</label>
            <select
                {...register(name)}
                className="w-full bg-background border border-border/80 rounded-[4px] px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors outline-none cursor-pointer appearance-none"
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
}
