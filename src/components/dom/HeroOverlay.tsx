"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { GITHUB_URL } from "@/lib/constants";

/**
 * Hero overlay positioned above the 3D scene.
 *
 * Features:
 * - Large industrial "OPENBITX" title with tight letter-spacing
 * - Glowing subtitle with the tagline
 * - Two CTA buttons: "Read the Docs" (primary) and "GitHub" (outline)
 * - Stagger-in Framer Motion animations
 * - Grid background pattern for visual depth
 */

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8 },
    },
};

export default function HeroOverlay() {
    return (
        <div className="relative z-10 min-h-screen flex items-center justify-center grid-bg">
            {/* Radial gradient overlay for vignette effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-void/30 via-transparent to-void pointer-events-none" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-20 text-center px-6 max-w-4xl mx-auto"
            >
                {/* Badge */}
                <motion.div variants={itemVariants} className="mb-8">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-neon-cyan border border-neon-cyan/20 bg-neon-cyan/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                        OPEN SOURCE LABORATORY
                    </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                    variants={itemVariants}
                    className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none mb-6"
                >
                    <span className="text-text-primary">OPEN</span>
                    <span className="text-neon-cyan text-glow-cyan">BIT</span>
                    <span className="text-text-primary">X</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    variants={itemVariants}
                    className="text-lg sm:text-xl md:text-2xl text-text-secondary font-light tracking-wide max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    The Nervous System for{" "}
                    <span className="text-neural-purple font-medium">Embodied</span>{" "}
                    Intelligence.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button variant="primary" size="lg" href="#docs">
                        Read the Docs
                        <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </Button>
                    <Button variant="outline" size="lg" href={GITHUB_URL}>
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                clipRule="evenodd"
                            />
                        </svg>
                        GitHub
                    </Button>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <div className="flex flex-col items-center gap-2 text-text-secondary">
                        <span className="text-[10px] font-mono tracking-widest uppercase">
                            Scroll
                        </span>
                        <motion.div
                            animate={{ y: [0, 6, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-4 h-6 rounded-full border border-text-secondary/30 flex items-start justify-center pt-1"
                        >
                            <div className="w-0.5 h-1.5 bg-text-secondary/50 rounded-full" />
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
