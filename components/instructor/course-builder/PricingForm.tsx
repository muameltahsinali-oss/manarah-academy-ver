import { useFormContext } from "react-hook-form";
import { FormSelect } from "./FormHelpers";

interface PricingFormProps {
    onNext: () => void;
    onSave: (data: any) => Promise<number | null>;
    isSubmitting: boolean;
}

export function PricingForm({ onNext, onSave, isSubmitting }: PricingFormProps) {
    const { register, trigger, getValues, formState: { errors } } = useFormContext<any>();

    const handleSaveAndNext = async () => {
        const isValid = await trigger(["price", "discountPrice", "type"]);
        if (isValid) {
            const data = getValues();
            const id = await onSave(data);
            if (id) {
                onNext();
            }
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-xl font-bold mb-8">خيارات التسعير والعروض</h2>
            <div className="flex flex-col gap-6 max-w-lg">
                <FormSelect name="type" label="نوع الدورة" options={["مدفوعة باشتراك دائم", "مجانية بالكامل", "اشتراك شهري ضمن مسار"]} />

                <div className="relative">
                    <label className="block text-sm font-bold text-text mb-2">السعر الأساسي (USD)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text/50 font-mono font-bold">$</span>
                        <input
                            type="text"
                            {...register("price")}
                            className={`w-full bg-background border rounded-[4px] pl-10 pr-4 py-3 text-sm font-mono focus:outline-none transition-colors text-left ${errors.price ? "border-red-500 focus:border-red-500" : "border-border/80 focus:border-primary"
                                }`}
                            dir="ltr"
                        />
                    </div>
                    {errors.price && (
                        <span className="text-xs text-red-500 font-bold block mt-2">{errors.price.message as string}</span>
                    )}
                </div>

                <div className="relative">
                    <label className="block text-sm font-bold text-text mb-2">سعر الخصم الافتتاحي (اختياري)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text/50 font-mono font-bold">$</span>
                        <input
                            type="text"
                            {...register("discountPrice")}
                            placeholder="0.00"
                            className={`w-full bg-background border rounded-[4px] pl-10 pr-4 py-3 text-sm font-mono focus:outline-none transition-colors text-left ${errors.discountPrice ? "border-red-500 focus:border-red-500" : "border-border/80 focus:border-primary"
                                }`}
                            dir="ltr"
                        />
                    </div>
                    {errors.discountPrice && (
                        <span className="text-xs text-red-500 font-bold block mt-2">{errors.discountPrice.message as string}</span>
                    )}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/40 font-mono flex justify-end">
                <button type="button" onClick={handleSaveAndNext} disabled={isSubmitting} className="px-6 py-3 bg-secondary text-white text-sm font-bold rounded-[4px] hover:bg-secondary/90 transition-colors disabled:opacity-50">
                    {isSubmitting ? "جاري الحفظ..." : "حفظ ومتابعة النشر"}
                </button>
            </div>
        </div>
    );
}
