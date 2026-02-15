/** Navigation links displayed in the Navbar */
export const NAV_LINKS = [
    { label: "Docs", href: "#docs" },
    { label: "Features", href: "#features" },
    { label: "Community", href: "#community" },
] as const;

/** GitHub repository URL */
export const GITHUB_URL = "https://github.com/OpenBitX";

/** Feature cards data for the BentoGrid section */
export const FEATURES = [
    {
        title: "Neural Firmware",
        description:
            "Flash AI models directly onto microcontrollers with a single command. From TinyML to edge inference — no cloud required.",
        icon: "⚡",
        accent: "neon-cyan" as const,
    },
    {
        title: "Synaptic SDK",
        description:
            "A unified API for sensors, actuators, and neural networks. Build embodied intelligence with composable primitives.",
        icon: "🧬",
        accent: "neural-purple" as const,
    },
    {
        title: "Silicon Playground",
        description:
            "Simulate hardware-in-the-loop before burning silicon. Virtual test benches for rapid prototyping.",
        icon: "🔬",
        accent: "neon-cyan" as const,
    },
    {
        title: "Open Hardware",
        description:
            "Reference designs for AI-accelerated dev boards. KiCad schematics, BOM, and fabrication files — fully open-source.",
        icon: "🛠️",
        accent: "neural-purple" as const,
    },
] as const;

