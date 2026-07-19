import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Crimson/maroon accent — primary brand color
        brand: {
          50:  "#fdf2f3",
          100: "#fce7e9",
          200: "#f8c9ce",
          300: "#f39aa2",
          400: "#eb6070",
          500: "#d93347",
          600: "#a31c2b",
          700: "#8b1623",
          800: "#721320",
          900: "#5c1019",
        },
        // Deep navy — sidebar background
        navy: {
          950: "#0f1219",
          900: "#1a1f2e",
          800: "#222840",
          700: "#2a3050",
          600: "#3b4a6b",
          500: "#4d5f84",
          400: "#6b7da8",
          300: "#8fa3c7",
          200: "#b8c5de",
          100: "#dde4f0",
          50:  "#f0f3f9",
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        card: "14px",
        btn: "8px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 16px rgba(0,0,0,0.10)",
        "card-lg": "0 4px 20px rgba(0,0,0,0.08)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
