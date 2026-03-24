"use client";

import { motion, AnimatePresence } from "framer-motion";
import { getFadeUp, getFadeIn } from "@/lib/motion";
import { useState, useEffect } from "react";
import { Info, Layers, DollarSign, Send, Loader2 } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateCourse, useInstructorCourse, useUpdateCourse } from "@/lib/hooks/useInstructor";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { CourseInfoForm } from "@/components/instructor/course-builder/CourseInfoForm";
import { CurriculumBuilder } from "@/components/instructor/course-builder/CurriculumBuilder";
import { PricingForm } from "@/components/instructor/course-builder/PricingForm";
import { PublishStep } from "@/components/instructor/course-builder/PublishForm";

export function handleApiError(error: any, defaultMessage: string) {
    const backendErrors = error.errors || error.response?.data?.errors;
    if (backendErrors && Object.keys(backendErrors).length > 0) {
        Object.keys(backendErrors).forEach(key => {
            backendErrors[key].forEach((msg: string) => toast.error(msg));
        });
    } else {
        toast.error(error.message || error.response?.data?.message || defaultMessage);
    }
}

const createCourseSchema = z.object({
    title: z.string().min(5, "يجب أن يحتوي العنوان على 5 أحرف على الأقل"),
    slug: z.string().min(3, "الرابط القصير قصير جداً"),
    description: z.string().min(20, "يرجى كتابة وصف أطول للتوضيح للطالب"),
    category: z.string(),
    level: z.string(),
    type: z.string(),
    price: z.string().optional().or(z.literal("")),
    discountPrice: z.string().optional().or(z.literal("")),
    thumbnail: z.string().optional().or(z.literal("")),
});

export type CourseFormValues = z.infer<typeof createCourseSchema>;

type Step = "info" | "curriculum" | "pricing" | "publish";

export function CreateCourseClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const editId = searchParams.get("edit");

    const [localCourseId, setLocalCourseId] = useState<number | null>(editId ? parseInt(editId) : null);
    const isEdit = !!localCourseId;

    const [activeStep, setActiveStep] = useState<Step>("info");

    const { data: courseRes, isLoading: isLoadingCourse } = useInstructorCourse(localCourseId);
    const { mutateAsync: createCourse, isPending: isCreating } = useCreateCourse();
    const { mutateAsync: updateCourse, isPending: isUpdating } = useUpdateCourse();

    const isSubmitting = isCreating || isUpdating;

    const methods = useForm<CourseFormValues>({
        resolver: zodResolver(createCourseSchema),
        defaultValues: {
            title: "",
            slug: "",
            description: "",
            category: "برمجة الواجهات",
            level: "مبتدئ",
            type: "مدفوعة باشتراك دائم",
            price: "149",
            discountPrice: "",
            thumbnail: "",
        },
        mode: "onChange"
    });

    const { reset } = methods;

    useEffect(() => {
        if (courseRes?.data) {
            const course = courseRes.data;
            reset({
                title: course.title || "",
                slug: course.slug || "",
                description: course.description || "",
                category: course.category || "برمجة الواجهات",
                level: course.level === "beginner" ? "مبتدئ" : course.level === "intermediate" ? "متوسط" : "متقدم",
                type: course.type || "مدفوعة باشتراك دائم",
                price: course.price?.toString() || "0",
                discountPrice: course.discount_price?.toString() || "",
                thumbnail: course.thumbnail || "",
            });
        }
    }, [courseRes, reset]);

    const handleSaveDraft = async (data: CourseFormValues) => {
        try {
            const payload = {
                title: data.title,
                slug: data.slug,
                description: data.description,
                category: data.category,
                type: data.type,
                price: parseFloat(data.price || "0"),
                discount_price: data.discountPrice ? parseFloat(data.discountPrice) : null,
                thumbnail: data.thumbnail || null,
                level: data.level === "مبتدئ" ? "beginner" : data.level === "متوسط" ? "intermediate" : "advanced",
                status: 'draft'
            };

            if (isEdit && localCourseId) {
                await updateCourse({ id: localCourseId, data: payload });
                toast.success("تم حفظ البيانات بنجاح");
                return localCourseId;
            } else {
                const res = await createCourse(payload);
                toast.success("تم إنشاء الدورة بنجاح");
                const newId = res?.data?.id || res?.id;
                setLocalCourseId(newId);
                router.push(`/instructor/create?edit=${newId}`);
                return newId;
            }
        } catch (error: any) {
            console.error(error);
            handleApiError(error, "حدث خطأ أثناء حفظ الدورة");
            return null;
        }
    };

    if (isLoadingCourse) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <FormProvider {...methods}>
            <div className="flex flex-col gap-12 w-full max-w-4xl mx-auto py-8">
                <motion.div {...getFadeUp(0, 0.4)}>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">منشئ الدورات</h1>
                    <p className="text-sm text-text/60">بناء منهج دراسي متكامل، تحديد التسعير، والنشر.</p>
                </motion.div>

                {/* Step Indicators */}
                <motion.div {...getFadeUp(0.1, 0.4)} className="flex border-b border-border/80">
                    <StepButton active={activeStep === "info"} onClick={() => setActiveStep("info")} icon={Info} label="المعلومات الأساسية" />
                    <StepButton
                        active={activeStep === "curriculum"}
                        onClick={() => setActiveStep("curriculum")}
                        icon={Layers}
                        label="المنهج الدراسي"
                        disabled={!isEdit}
                    />
                    <StepButton
                        active={activeStep === "pricing"}
                        onClick={() => setActiveStep("pricing")}
                        icon={DollarSign}
                        label="التسعير"
                        disabled={!isEdit}
                    />
                    <StepButton
                        active={activeStep === "publish"}
                        onClick={() => setActiveStep("publish")}
                        icon={Send}
                        label="المراجعة والنشر"
                        disabled={!isEdit}
                    />
                </motion.div>

                {/* Form Container */}
                <form className="bg-white border border-border/80 rounded-[4px] min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            {...getFadeIn(0, 0.3)}
                        >
                            {activeStep === "info" && <CourseInfoForm onNext={() => setActiveStep("curriculum")} onSave={handleSaveDraft} isSubmitting={isSubmitting} />}
                            {activeStep === "curriculum" && <CurriculumBuilder onNext={() => setActiveStep("pricing")} courseId={localCourseId} />}
                            {activeStep === "pricing" && <PricingForm onNext={() => setActiveStep("publish")} onSave={handleSaveDraft} isSubmitting={isSubmitting} />}
                            {activeStep === "publish" && <PublishStep isSubmitting={isSubmitting} courseId={localCourseId} />}
                        </motion.div>
                    </AnimatePresence>
                </form>
            </div>
        </FormProvider>
    );
}

function StepButton({ active, onClick, icon: Icon, label, disabled }: { active: boolean, onClick: () => void, icon: any, label: string, disabled?: boolean }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`flex-1 flex flex-col md:flex-row items-center justify-center gap-2 p-4 text-sm font-bold transition-all border-b-[3px] -mb-[1px] disabled:opacity-30 disabled:cursor-not-allowed ${active
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-text/60 hover:text-text hover:bg-black/5"
                }`}
        >
            <Icon className="w-4 h-4" />
            <span className="hidden md:inline">{label}</span>
        </button>
    );
}
