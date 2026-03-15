/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "15px",
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "960px",
      xl: "1200px",
    },
    fontFamily: {
      primary: "var(--font-figtree)",
    },
    extend: {
      colors: {
        background: "#f8fafb",
        foreground: "#1a2f2b",
        primary: "#0f766e",
        accent: {
          DEFAULT: "#2dd4bf",
          hover: "#14b8a6",
        },
        heading: "#1a2f2b",
        body: "#64748b",
        muted: "#94a3b8",
        surface: "#f0f5f4",
        soft: "#b2dfdb",
        border: "#d1e5e2",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "orb-drift": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(20px, -15px)" },
        },
      },
      animation: {
        "orb-drift": "orb-drift 8s ease-in-out infinite",
        "orb-drift-slow": "orb-drift 12s ease-in-out infinite reverse",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
