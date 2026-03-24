import { LearningPathsClient } from "./LearningPathsClient";

export const metadata = {
    title: "مسارات التعلم | منارة اكاديمي",
    description: "أنشئ مسارات تعلم مخصصة بالذكاء الاصطناعي حسب هدفك.",
};

export default function LearningPathsPage() {
    return <LearningPathsClient />;
}
