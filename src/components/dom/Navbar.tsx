"use client";

import { motion } from "framer-motion";
import { NAV_LINKS, GITHUB_URL } from "@/lib/constants";
import Button from "@/components/ui/Button";

/**
 * Fixed top navigation bar with glassmorphism effect.
 *
 * Features:
 * - OpenBitX logo with neon-cyan accent
 * - Navigation links with hover animations
 * - GitHub CTA button
 * - Backdrop blur glass effect background
 */
export default function Navbar() {
    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="fixed top-0 left-0 right-0 z-50 glass"
        >
            <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-md bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center group-hover:bg-neon-cyan/30 transition-colors duration-300">
                        <span className="text-neon-cyan font-bold text-sm font-mono">X</span>
                    </div>
                    <span className="text-text-primary font-bold text-lg tracking-tight">
                        Open<span className="text-neon-cyan">Bit</span>X
                    </span>
                </a>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-text-secondary hover:text-neon-cyan text-sm font-medium tracking-wide transition-colors duration-300 relative group"
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-neon-cyan group-hover:w-full transition-all duration-300" />
                        </a>
                    ))}
                </div>

                {/* GitHub CTA */}
                <Button variant="outline" size="sm" href={GITHUB_URL}>
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
            </div>
        </motion.nav>
    );
}
