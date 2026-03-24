export const transitionParams = {
    ease: "easeOut" as any,
};

export const getFadeUp = (delay: number = 0, duration: number = 0.5) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration, delay, ...transitionParams } },
});

export const getFadeIn = (delay: number = 0, duration: number = 0.4) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration, delay, ...transitionParams } },
    exit: { opacity: 0, transition: { duration, delay, ...transitionParams } }
});

export const slideIn = (direction: "left" | "right" | "up" | "down", delay: number = 0) => ({
    initial: {
        opacity: 0,
        x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
        y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
    },
    animate: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.5, delay, ...transitionParams }
    }
});

export const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};
