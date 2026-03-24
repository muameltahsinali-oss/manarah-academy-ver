"use client";

import { useEffect, useState } from "react";

interface KPIProps {
    label: string;
    value: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    className?: string;
}

function CountUp({ end, duration = 2 }: { end: number, duration?: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = end / (duration * 60);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                clearInterval(timer);
                setCount(end);
            } else {
                setCount(Math.floor(start));
            }
        }, 1000 / 60);

        return () => clearInterval(timer);
    }, [end, duration]);

    return <>{count}</>;
}

export function KPI({ label, value, suffix = "", prefix = "", duration = 2, className = "" }: KPIProps) {
    return (
        <div className={`border border-border bg-white p-6 rounded-[4px] ${className}`}>
            <p className="text-xs font-mono text-text/50 uppercase tracking-widest mb-2">{label}</p>
            <div className="text-4xl font-bold font-mono text-primary flex items-baseline gap-1">
                {prefix && <span>{prefix}</span>}
                <CountUp end={value} duration={duration} />
                {suffix && <span>{suffix}</span>}
            </div>
        </div>
    );
}
