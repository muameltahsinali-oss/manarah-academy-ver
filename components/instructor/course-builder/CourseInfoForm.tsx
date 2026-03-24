import { useFormContext, Controller } from "react-hook-form";
import { ImageUpload } from "@/components/instructor/ImageUpload";
import { FormInput, FormSelect } from "./FormHelpers";
import { toast } from "sonner";

interface CourseInfoFormProps {
    onNext: () => void;
    onSave: (data: any) => Promise<number | null>;
    isSubmitting: boolean;
}

export function CourseInfoForm({ onNext, onSave, isSubmitting }: CourseInfoFormProps) {
    const { register, trigger, getValues, control, formState: { errors } } = useFormContext<any>();

    const handleSaveAndNext = async () => {
        const isValid = await trigger(["title", "slug", "description", "category", "level", "thumbnail"]);
        if (isValid) {
            const data = getValues();
            const id = await onSave(data);
            if (id) {
                onNext();
            }
        } else {
            console.error("CourseInfoForm validation failed:", errors);
            toast.error("يرجى التأكد من تعبئة جميع الحقول المطلوبة بشكل صحيح");
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-xl font-bold mb-8">المعلومات الأساسية للدورة</h2>
            <div className="flex flex-col gap-6 max-w-2xl">
                <FormInput name="title" label="عنوان الدورة" placeholder="أدخل اسماً واضحاً ومميزاً للدورة..." />
                <FormInput name="slug" label="الرابط المختصر (Slug)" placeholder="يجب أن يحتوي على حروف لاتينية صغيرة وشرطات فقط..." fontMono />

                <div>
                    <label className="block text-sm font-bold text-text mb-2">وصف الدورة الشامل</label>
                    <textarea
                        {...register("description")}
                        className={`w-full bg-background border rounded-[4px] px-4 py-3 text-sm focus:outline-none transition-colors resize-none h-40 ${errors.description ? "border-red-500 focus:border-red-500" : "border-border/80 focus:border-primary"
                            }`}
                        placeholder="ماذا سيتعلم الطالب من هذه الدورة؟..."
                    />
                    {errors.description && (
                        <span className="text-xs text-red-500 font-bold block mt-2">{errors.description.message as string}</span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <FormSelect name="category" label="القسم" options={["تطوير وبرمجة", "تصميم وجرافيكس", "تسويق وأعمال", "اقتصاد", "تعليم ولغات", "نمط حياة"]} />
                    <FormSelect name="level" label="المستوى" options={["مبتدئ", "متوسط", "متقدم", "شامل"]} />
                </div>

                <div>
                    <label className="block text-sm font-bold text-text mb-2">صورة الغلاف (Thumbnail)</label>
                    <Controller
                        name="thumbnail"
                        control={control}
                        render={({ field }) => (
                            <ImageUpload
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    {errors.thumbnail && (
                        <span className="text-xs text-red-500 font-bold block mt-2">{errors.thumbnail.message as string}</span>
                    )}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/40 font-mono flex justify-end">
                <button type="button" onClick={handleSaveAndNext} disabled={isSubmitting} className="px-6 py-3 bg-secondary text-white text-sm font-bold rounded-[4px] hover:bg-secondary/90 transition-colors disabled:opacity-50">
                    {isSubmitting ? "جاري الحفظ..." : "حفظ ومتابعة"}
                </button>
            </div>
        </div>
    );
}
