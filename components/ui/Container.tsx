import { HTMLAttributes, forwardRef } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    // Option to enforce 12-column CSS grid inside the container
    grid?: boolean;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
    ({ className = "", grid = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`container mx-auto px-4 md:px-8 max-w-7xl ${grid ? "grid grid-cols-1 md:grid-cols-12 gap-6" : ""} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Container.displayName = "Container";
