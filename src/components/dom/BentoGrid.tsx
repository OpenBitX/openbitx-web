"use client";

import { motion } from "framer-motion";
import { FEATURES } from "@/lib/constants";

/**
 * Bento-style grid showcasing OpenBitX features.
 *
 * Each card uses glassmorphism styling with a neon accent border
 * that matches the feature's color. Cards animate in with a stagger
 * effect as they enter the viewport.
 */

const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6 },
    },
};

export default function BentoGrid() {
    return (
        <section id="features" className="relative z-10 py-32 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Built for the{" "}
                        <span className="text-neon-cyan text-glow-cyan">Edge</span>
                    </h2>
                    <p className="text-text-secondary text-lg max-w-xl mx-auto">
                        Everything you need to design, simulate, and deploy embodied AI
                        systems — from silicon to synapse.
                    </p>
                </motion.div>

                {/* Feature Cards Grid */}
                <motion.div
                    variants={gridVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                    {FEATURES.map((feature, index) => {
                        const isAccentCyan = feature.accent === "neon-cyan";
                        const accentBorder = isAccentCyan
                            ? "hover:border-neon-cyan/30"
                            : "hover:border-neural-purple/30";
                        const accentGlow = isAccentCyan
                            ? "group-hover:shadow-[0_0_40px_rgba(0,255,148,0.08)]"
                            : "group-hover:shadow-[0_0_40px_rgba(112,0,255,0.08)]";
                        const iconBg = isAccentCyan
                            ? "bg-neon-cyan/10 border-neon-cyan/20"
                            : "bg-neural-purple/10 border-neural-purple/20";

                        return (
                            <motion.div
                                key={feature.title}
                                variants={cardVariants}
                                className={`group relative glass glass-hover rounded-2xl p-8 transition-all duration-500 ${accentBorder} ${accentGlow} ${index === 0 ? "md:row-span-1" : ""
                                    }`}
                            >
                                {/* Accent gradient bar at top */}
                                <div
                                    className={`absolute top-0 left-8 right-8 h-[1px] ${isAccentCyan
                                            ? "bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent"
                                            : "bg-gradient-to-r from-transparent via-neural-purple/40 to-transparent"
                                        } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                                />

                                {/* Icon */}
                                <div
                                    className={`w-12 h-12 rounded-xl ${iconBg} border flex items-center justify-center text-xl mb-5`}
                                >
                                    {feature.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold tracking-tight mb-3 text-text-primary">
                                    {feature.title}
                                </h3>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Arrow indicator */}
                                <div className="mt-6 flex items-center gap-2 text-text-secondary opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300">
                                    <span className="text-xs font-mono tracking-wider">
                                        LEARN MORE
                                    </span>
                                    <svg
                                        className="w-3 h-3"
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
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
