import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "OpenBitX — Embedded AI Laboratory",
    description:
        "The Nervous System for Embodied Intelligence. Open-source tools for neural firmware, synaptic SDKs, and silicon-level AI development.",
    keywords: [
        "embedded AI",
        "TinyML",
        "edge inference",
        "open source",
        "neural firmware",
        "hardware",
    ],
    openGraph: {
        title: "OpenBitX — Embedded AI Laboratory",
        description:
            "The Nervous System for Embodied Intelligence. Open-source tools for neural firmware, synaptic SDKs, and silicon-level AI development.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-void text-text-primary`}
            >
                {children}
            </body>
        </html>
    );
}
