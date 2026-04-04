import { useFormContext, Controller } from "react-hook-form";
import { useState, useMemo } from "react";
import { ImageUpload } from "@/components/instructor/ImageUpload";
import { FormInput, FormSelect } from "./FormHelpers";
import { LearningOutcomesField } from "./LearningOutcomesField";
import { toast } from "sonner";
import { parsePromoVideoUrl, withAutoplay } from "@/lib/utils/promoVideo";
import { CoursePromoVideoModal } from "@/components/course/CoursePromoVideoModal";
import { PlayCircle } from "lucide-react";

interface CourseInfoFormProps {
    onNext: () => void;
    onSave: (data: any) => Promise<number | null>;
    isSubmitting: boolean;
}

export function CourseInfoForm({ onNext, onSave, isSubmitting }: CourseInfoFormProps) {
    const { register, trigger, getValues, control, watch, formState: { errors } } = useFormContext<any>();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewEmbed, setPreviewEmbed] = useState<string | null>(null);

    const promoVideoUrl = watch("promoVideoUrl") as string | undefined;
    const parsedPreview = useMemo(
        () => (promoVideoUrl?.trim() ? parsePromoVideoUrl(promoVideoUrl.trim()) : null),
        [promoVideoUrl]
    );
    const canPreview = !!parsedPreview;

    const openPreview = () => {
        if (!parsedPreview) {
            return;
        }
        setPreviewEmbed(withAutoplay(parsedPreview.embedUrl));
        setPreviewOpen(true);
    };

    const closePreview = () => {
        setPreviewOpen(false);
        setPreviewEmbed(null);
    };

    const handleSaveAndNext = async () => {
        const isValid = await trigger([
            "title",
            "slug",
            "description",
            "shortDescription",
            "promoVideoUrl",
            "category",
            "level",
            "thumbnail",
            "learningOutcomeRows",
        ]);
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
                    <label className="block text-sm font-bold text-text mb-2">
                        وصف قصير (يظهر في صفحة الدورة) <span className="font-normal text-text/50">— اختياري</span>
                    </label>
                    <textarea
                        {...register("shortDescription")}
                        className={`w-full bg-background border rounded-[4px] px-4 py-3 text-sm focus:outline-none transition-colors resize-none h-28 ${errors.shortDescription ? "border-red-500 focus:border-red-500" : "border-border/80 focus:border-primary"
                            }`}
                        placeholder="جملة أو فقرتان تبرزان قيمة الدورة للطالب..."
                    />
                    {errors.shortDescription && (
                        <span className="text-xs text-red-500 font-bold block mt-2">{errors.shortDescription.message as string}</span>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold text-text mb-2">
                        رابط فيديو تعريفي (يوتيوب أو فيميو) <span className="font-normal text-text/50">— اختياري</span>
                    </label>
                    <p className="text-xs text-text/55 mb-2">يمكنك ترك الحقل فارغاً؛ سيُعرض الغلاف فقط في صفحة الدورة دون زر معاينة.</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            inputMode="url"
                            autoComplete="off"
                            {...register("promoVideoUrl")}
                            placeholder="https://www.youtube.com/watch?v=… أو https://vimeo.com/…"
                            className={`flex-1 bg-background border rounded-[4px] px-4 py-3 text-sm font-mono focus:outline-none transition-colors ${errors.promoVideoUrl ? "border-red-500 focus:border-red-500" : "border-border/80 focus:border-primary"
                                }`}
                        />
                        <button
                            type="button"
                            onClick={openPreview}
                            disabled={!canPreview}
                            className="inline-flex items-center justify-center gap-2 shrink-0 px-4 py-3 rounded-[4px] border border-border/80 bg-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary/50 hover:bg-primary/5 transition-colors"
                        >
                            <PlayCircle className="w-4 h-4" />
                            معاينة الفيديو
                        </button>
                    </div>
                    {promoVideoUrl?.trim() && !canPreview && (
                        <p className="text-xs text-amber-600 font-medium mt-2">الرابط لا يطابق يوتيوب أو فيميو صالحاً</p>
                    )}
                    {errors.promoVideoUrl && (
                        <span className="text-xs text-red-500 font-bold block mt-2">{errors.promoVideoUrl.message as string}</span>
                    )}
                </div>

                <LearningOutcomesField />

                <div>
                    <label className="block text-sm font-bold text-text mb-2">وصف الدورة الشامل</label>
                    <textarea
                        {...register("description")}
                        className={`w-full bg-background border rounded-[4px] px-4 py-3 text-sm focus:outline-none transition-colors resize-none h-40 ${errors.description ? "border-red-500 focus:border-red-500" : "border-border/80 focus:border-primary"
                            }`}
                        placeholder="ماذا سيتعلم الطالب من هذه الدورة؟ تفاصيل المنهج، الأسلوب، ومن يستهدفها..."
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

            <CoursePromoVideoModal
                open={previewOpen}
                onClose={closePreview}
                embedUrl={previewEmbed}
                title="معاينة الفيديو التعريفي"
            />

            <div className="mt-8 pt-6 border-t border-border/40 font-mono flex justify-end">
                <button type="button" onClick={handleSaveAndNext} disabled={isSubmitting} className="px-6 py-3 bg-secondary text-white text-sm font-bold rounded-[4px] hover:bg-secondary/90 transition-colors disabled:opacity-50">
                    {isSubmitting ? "جاري الحفظ..." : "حفظ ومتابعة"}
                </button>
            </div>
        </div>
    );
}
