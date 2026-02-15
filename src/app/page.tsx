"use client";

import dynamic from "next/dynamic";
import HeroOverlay from "@/components/dom/HeroOverlay";
import Navbar from "@/components/dom/Navbar";
import BentoGrid from "@/components/dom/BentoGrid";

/**
 * Dynamically import the 3D Scene (client component with Three.js / WebGL).
 * SSR disabled because Canvas requires the browser's WebGL context.
 */
const Scene = dynamic(() => import("@/components/canvas/Scene"), {
    ssr: false,
});

export default function Home() {
    return (
        <>
            {/* 3D background layer — fixed behind everything */}
            <Scene />

            {/* DOM content layer */}
            <Navbar />

            <main>
                {/* Hero section with text overlay on the 3D scene */}
                <HeroOverlay />

                {/* Feature showcase — bento grid with glass cards */}
                <div className="relative z-10 bg-void">
                    <BentoGrid />

                    {/* Footer */}
                    <footer className="relative z-10 py-16 px-6 border-t border-border-subtle">
                        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center">
                                    <span className="text-neon-cyan font-bold text-[10px] font-mono">
                                        X
                                    </span>
                                </div>
                                <span className="text-text-secondary text-sm">
                                    © {new Date().getFullYear()} OpenBitX. Open
                                    source under MIT License.
                                </span>
                            </div>
                            <div className="flex items-center gap-6">
                                <a
                                    href="https://github.com/OpenBitX"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-text-secondary hover:text-neon-cyan text-sm transition-colors duration-300"
                                >
                                    GitHub
                                </a>
                                <a
                                    href="#docs"
                                    className="text-text-secondary hover:text-neon-cyan text-sm transition-colors duration-300"
                                >
                                    Documentation
                                </a>
                                <a
                                    href="#features"
                                    className="text-text-secondary hover:text-neon-cyan text-sm transition-colors duration-300"
                                >
                                    Features
                                </a>
                            </div>
                        </div>
                    </footer>
                </div>
            </main>
        </>
    );
}
