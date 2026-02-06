// Framer Motion Animation Variants
export const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

export const fadeInDown = {
    hidden: { opacity: 0, y: -40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.5 },
    },
};

export const slideInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

export const slideInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

// Page transition variants
export const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3, ease: "easeIn" },
    },
};

// Text reveal animation
export const textReveal = {
    hidden: {
        opacity: 0,
        y: "100%",
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.6, 0.01, 0.05, 0.95],
        },
    },
};

// Hover animations
export const hoverScale = {
    scale: 1.05,
    transition: { duration: 0.2 },
};

export const hoverLift = {
    y: -5,
    transition: { duration: 0.2 },
};

// Navbar animations
export const navbarAnimation = {
    hidden: { y: -100, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

// Progress bar animation
export const progressAnimation = (percentage: number) => ({
    initial: { width: 0 },
    animate: {
        width: `${percentage}%`,
        transition: { duration: 1, ease: "easeOut", delay: 0.2 },
    },
});

// Card hover animation
export const cardHover = {
    rest: {
        scale: 1,
        boxShadow: "0 0 0 rgba(0, 212, 255, 0)",
    },
    hover: {
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0, 212, 255, 0.15)",
        transition: { duration: 0.3 },
    },
};
