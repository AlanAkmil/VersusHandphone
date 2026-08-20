import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0B0D12",
        panel: "#12151D",
        line: "#1A1F2B",
        mist: "#8B92A6",
        fog: "#C4C9D4",
        contender: {
          a: "#4CC9F0",
          "a-dim": "#1C4A5C",
          b: "#FF6B35",
          "b-dim": "#5C2E17",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "seam-glow":
          "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(76,201,240,0.08), transparent 70%)",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(2000%)", opacity: "0" },
        },
        pulseWin: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        scan: "scan 2.4s ease-in-out infinite",
        pulseWin: "pulseWin 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
