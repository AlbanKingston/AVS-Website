import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#0B0B0B",
        charcoal: "#151515",
        surface: "#242424",
        gold: {
          DEFAULT: "#D6AD55",
          light: "#F0D58A",
          dark: "#B8922E",
        },
        ivory: "#F5F1E8",
        muted: "#A9A9A9",
        border: "#333333",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #D6AD55 0%, #F0D58A 50%, #D6AD55 100%)",
        "gold-gradient-subtle":
          "linear-gradient(135deg, rgba(214,173,85,0.15) 0%, rgba(240,213,138,0.08) 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(214,173,85,.25)",
        "glow-sm": "0 0 20px rgba(214,173,85,.15)",
        "glow-lg": "0 0 60px rgba(214,173,85,.30)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-24px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
