/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#080b12",
        surface: "#0f1523",
        border: "rgba(255,255,255,0.08)",
        green: { 400: "#4ade80", 500: "#22c55e" },
        cyan: { 400: "#22d3ee" },
        indigo: { 400: "#818cf8" },
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};