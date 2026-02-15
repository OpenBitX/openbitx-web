"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    href?: string;
    children: React.ReactNode;
}

/**
 * Reusable Button atom with multiple variants.
 *
 * - primary: Solid neon-cyan background with dark text
 * - outline: Transparent with neon-cyan border and text
 * - ghost: Transparent with subtle hover background
 *
 * If `href` is provided, renders as an anchor tag instead of a button.
 */
export default function Button({
    variant = "primary",
    size = "md",
    href,
    children,
    className,
    ...props
}: ButtonProps) {
    const baseStyles =
        "inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-300 rounded-lg cursor-pointer select-none";

    const variants = {
        primary:
            "bg-neon-cyan text-void hover:shadow-[0_0_30px_rgba(0,255,148,0.4)] hover:scale-[1.02] active:scale-[0.98]",
        outline:
            "border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan/70 active:scale-[0.98]",
        ghost:
            "text-text-secondary hover:text-text-primary hover:bg-surface-hover",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
    };

    const classes = cn(baseStyles, variants[variant], sizes[size], className);

    if (href) {
        return (
            <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        );
    }

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
}
