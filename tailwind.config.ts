import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/templates/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f0d0b",
        paper: "#f5efe6",
        accent: "#ff6a2a",
        card: "#171512",
        tile: "#1b1916",
        "tile-2": "#211e1a",
        line: "#2a2621",
        "line-strong": "#35302a",
        "line-soft": "#221f1b",
        edge: "#4a443b",
        "fg-2": "#e7e0d4",
        "fg-3": "#cfc6b8",
        muted: "#a89f91",
        dim: "#8c8376",
        canvas: "#0e0e11",
        surface: "#18181b",
        banter: {
          dark: "#141413",
          cream: "#f4f3f0",
          peach: "#ffe9df",
          terracotta: "#c2410c",
          orange: "#ea580c",
        },
        cyber: {
          cyan: "#06b6d4",
          indigo: "#6366f1",
          emerald: "#10b981",
          amber: "#f59e0b",
        },
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px rgba(0,0,0,1)",
        "brutal-sm": "2px 2px 0px 0px rgba(0,0,0,1)",
        "brutal-orange": "4px 4px 0px 0px #c2410c",
        "brutal-cyan": "4px 4px 0px 0px #06b6d4",
        "card-warm": "0 10px 30px -10px rgba(0,0,0,0.8)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        display: ["var(--font-display)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
