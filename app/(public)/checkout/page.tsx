import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import CheckoutPageClient from "./CheckoutPageClient";

/**
 * مسار ثابت `/checkout` بدون `[id]` — مناسب لـ `output: "export"`.
 * التحقق يعتمد على `?payment_id=` فقط (كان `[id]` غير مستخدم في الواجهة).
 */
function CheckoutFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<CheckoutFallback />}>
            <CheckoutPageClient />
        </Suspense>
    );
}
