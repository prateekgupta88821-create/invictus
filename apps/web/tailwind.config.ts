import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: "#0f2942",
          dark: "#0a192f",
          blue: "#1e3a8a",
          sky: "#0284c7",
          gold: "#b45309",
          slate: "#f1f5f9",
          border: "#cbd5e1"
        },
        status: {
          pass: "#16a34a",
          passBg: "#dcfce7",
          verify: "#d97706",
          verifyBg: "#fef3c7",
          fail: "#dc2626",
          failBg: "#fee2e2"
        }
      },
      fontFamily: {
        sans: ["Segoe UI", "-apple-system", "BlinkMacSystemFont", "Roboto", "sans-serif"],
      }
    },
  },
  plugins: [],
};
export default config;
