"use client"

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollAnimationProps {
    children: ReactNode;
    delay?: number;
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({ children, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
                duration: 0.5,
                delay: delay,
                ease: "easeOut"
            }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollAnimation;
