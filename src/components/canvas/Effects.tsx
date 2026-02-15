"use client";

import { Bloom, EffectComposer, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

/**
 * Post-processing effects for the shader background.
 *
 * - Bloom: Catches the bright neon emissions from the fragment shader
 *   and spreads them into a soft glow. Low threshold to pick up
 *   circuit glow and data packet flashes.
 * - Noise: Subtle film grain for texture.
 */
export default function Effects() {
    return (
        <EffectComposer>
            <Bloom
                luminanceThreshold={0.3}
                luminanceSmoothing={0.8}
                intensity={1.2}
                mipmapBlur
            />
            <Noise
                premultiply
                blendFunction={BlendFunction.ADD}
                opacity={0.015}
            />
        </EffectComposer>
    );
}
