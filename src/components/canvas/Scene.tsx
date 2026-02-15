"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import BinaryCircuitShader from "./BinaryCircuitShader";
import Effects from "./Effects";

/**
 * Main 3D scene wrapper.
 *
 * Renders a single full-screen shader plane as a fixed background.
 * No lights needed — the shader is fully emissive / unlit.
 * Camera is orthographic-like (shader uses clip-space coordinates directly).
 */
export default function Scene() {
    return (
        <div className="fixed inset-0 z-0">
            <Canvas
                dpr={[1, 1.5]}
                gl={{
                    antialias: false,
                    alpha: false,
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: false,
                }}
            >
                <Suspense fallback={null}>
                    <BinaryCircuitShader />
                    <Effects />
                </Suspense>
            </Canvas>
        </div>
    );
}
