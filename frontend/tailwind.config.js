/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1440px",
    },
    colors: {
      background: "var(--color-background)",
      decobackground: "var(--color-decobackground)",
      text: "var(--color-text)",
      gray: "var(--color-gray)",
      darkgray: "var(--color-darkgray)",
      blue: "var(--color-blue)",
      darkblue: "var(--color-darkblue)",
      purple: "var(--color-purple)",
      error: "var(--color-error)",
    },
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
    },
    extend: {
      animation: {
        "pulse-short": "pulse 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
