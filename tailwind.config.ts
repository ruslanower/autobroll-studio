import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        studio: {
          900: "#0b0d13",
          850: "#10131c",
          800: "#161b27",
          700: "#21283b",
          600: "#323d57",
          border: "#262f44",
        },
        accent: {
          cyan: "#00F2FE",
          indigo: "#4FACFE",
          purple: "#7F00FF",
          pink: "#E100FF",
          emerald: "#10B981",
          amber: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 10px rgba(79, 172, 254, 0.3)" },
          "100%": { boxShadow: "0 0 25px rgba(0, 242, 254, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
