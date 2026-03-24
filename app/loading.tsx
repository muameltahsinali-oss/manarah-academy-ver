export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 w-full">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-mono text-text/60 animate-pulse">جاري تحميل البيانات...</p>
        </div>
    );
}
