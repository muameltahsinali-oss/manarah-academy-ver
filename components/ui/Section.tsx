import { HTMLAttributes, forwardRef } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
    // Use Tailwind spacing intervals: e.g., 'py-16' (64px) or 'py-24' (96px) from the 8px scale
    spacing?: "sm" | "md" | "lg" | "xl" | "none";
    borderBottom?: boolean;
}

const spacingMap = {
    none: "py-0",
    sm: "py-8",    // 32px
    md: "py-16",   // 64px
    lg: "py-24",   // 96px
    xl: "py-32",   // 128px
};

export const Section = forwardRef<HTMLElement, SectionProps>(
    ({ className = "", spacing = "lg", borderBottom = false, children, ...props }, ref) => {
        return (
            <section
                ref={ref}
                className={`relative ${spacingMap[spacing]} ${borderBottom ? "border-b border-border" : ""} ${className}`}
                {...props}
            >
                {children}
            </section>
        );
    }
);

Section.displayName = "Section";
