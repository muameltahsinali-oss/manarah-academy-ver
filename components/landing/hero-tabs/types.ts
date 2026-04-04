/** Single “scene” shown inside the browser-style hero window. */
export type HeroTabScene = {
    id: string;
    /** Short label in the tab bar */
    label: string;
    headline: string;
    subtitle: string;
    imageSrc: string;
    imageAlt: string;
    cta: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
    /** 0–100 when showing progress (logged-in “Your progress”) */
    progress?: number;
    badge?: string;
};
