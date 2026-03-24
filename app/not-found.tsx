import Link from "next/link";
import { FileQuestion, ArrowRight } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 w-full max-w-md mx-auto text-center px-4">
            <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border border-border/80 mb-4">
                <FileQuestion className="w-8 h-8 text-text/40" />
            </div>
            <h2 className="text-4xl font-bold font-mono text-primary mb-2">404</h2>
            <h3 className="text-xl font-bold mb-4">الصفحة غير موجودة</h3>
            <p className="text-sm text-text/60 leading-relaxed mb-8">
                عذراً، الرابط الذي تحاول الوصول إليه غير موجود أو تم نقله. تفقد الرابط أو عد إلى لوحة التحكم.
            </p>
            <Link
                href="/"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary/10 text-primary border border-primary/20 text-sm font-bold rounded-[4px] hover:bg-primary hover:text-white transition-all"
            >
                <ArrowRight className="w-4 h-4" />
                العودة للرئيسية
            </Link>
        </div>
    );
}
