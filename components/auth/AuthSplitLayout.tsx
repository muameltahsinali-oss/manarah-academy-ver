/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

export default function AuthSplitLayout({
    title,
    subtitle,
    children,
    backHref = '/',
    backText = 'العودة للموقع',
}: {
    title?: string;
    subtitle?: string;
    children: ReactNode;
    backHref?: string;
    backText?: string;
}) {
    const slides = useMemo(
        () => [
            {
                imageUrl:
                    'https://images.unsplash.com/photo-1698993026848-f67c1eb7f989?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                title: 'التعلّم بشكل ذكي,',
                subtitle: 'نحو فهم أعمق ونتائج أفضل',
            },
            {
                imageUrl:
                    'https://images.unsplash.com/photo-1764720573370-5008f1ccc9fa?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                title: 'فصل نابض بالحياة,',
                subtitle: 'تفاعل وابتكار كل يوم',
            },
            {
                imageUrl:
                    'https://images.unsplash.com/photo-1716726314467-5d7dfde1ca2d?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                title: 'معرفة تُلهم,',
                subtitle: 'وتنمية مستمرة للمهارات',
            },
        ],
        [],
    );

    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((s) => (s + 1) % slides.length);
        }, 4500);

        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div dir="rtl" className="min-h-screen bg-secondary text-white">
            <div className="relative min-h-screen">
                {/* Dark brand gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/90 to-primary/30" />

                <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 md:py-16">
                    <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-10 items-stretch">
                        {/* Left hero */}
                        <div className="hidden md:flex md:w-1/2 flex-col rounded-2xl p-8 bg-black/10 border border-white/10 backdrop-blur relative overflow-hidden">
                            {/* Layered background for smooth fading transitions */}
                            {slides.map((s, i) => {
                                const isActive = i === activeSlide;
                                return (
                                    <div
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={i}
                                        className={[
                                            'absolute inset-0 bg-cover bg-center',
                                            'z-0',
                                            'transition-opacity duration-700 ease-in-out',
                                            isActive ? 'opacity-35' : 'opacity-0',
                                            'transform transition-transform duration-700 ease-in-out',
                                            isActive ? 'scale-100' : 'scale-105',
                                        ].join(' ')}
                                        // "Illustration" vibe: soften colors + boost contrast slightly.
                                        style={{
                                            backgroundImage: `url('${s.imageUrl}')`,
                                            filter: 'grayscale(0.85) saturate(0.45) contrast(1.2) brightness(1.03)',
                                        }}
                                        aria-hidden="true"
                                    />
                                );
                            })}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/35 z-[1]" />

                            {/* Sketchy overlay lines */}
                            <div
                                className="absolute inset-0 z-[2] pointer-events-none opacity-20"
                                style={{
                                    backgroundImage:
                                        'repeating-linear-gradient(45deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, rgba(255,255,255,0) 1px, rgba(255,255,255,0) 8px)',
                                    mixBlendMode: 'soft-light',
                                }}
                                aria-hidden="true"
                            />

                            <div className="relative z-10 flex items-center justify-between mb-10">
                                <Link href={backHref} className="text-sm font-bold text-white/80 hover:text-white transition-colors">
                                    {backText} &rarr;
                                </Link>
                                <div className="font-extrabold tracking-wide text-xl text-white/90">منارة اكاديمي</div>
                            </div>

                            <div className="relative z-10 mt-auto transition-opacity duration-500 ease-in-out">
                                <div className="text-center">
                                    <div className="text-white/90 text-2xl font-extrabold leading-tight">
                                        {slides[activeSlide]?.title}
                                        <br />
                                        {slides[activeSlide]?.subtitle}
                                    </div>
                                    <div className="mt-10 flex items-center justify-center gap-2">
                                        {slides.map((_, i) => {
                                            const isActive = i === activeSlide;
                                            return (
                                                <span
                                                    key={i}
                                                    className={`h-2 rounded-full ${isActive ? 'bg-white/35 w-12' : 'bg-white/15 w-2'}`}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right card */}
                        <div className="w-full md:w-1/2 flex items-center justify-center">
                            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-7 md:p-8 backdrop-blur">
                                {(title || subtitle) && (
                                    <div className="text-center mb-8">
                                        {title && <h1 className="text-2xl md:text-3xl font-extrabold">{title}</h1>}
                                        {subtitle && <p className="mt-2 text-sm text-white/70 leading-relaxed">{subtitle}</p>}
                                    </div>
                                )}
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

