const { createPreset, defineTheme } = require("tailwindcss-shadcn-ui");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  // 1. Tell Tailwind where to look for class names:
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        primary: "var(--color-primary)",
        accent: "var(--color-bg)",
      },
    },
  },

  // 2a) Use the shadcn preset (recommended) --------------------
  presets: [
    createPreset({
      theme: defineTheme({
        light: {
          background: "#F0EDCC",
          foreground: "#02343F",
        },
        dark: {
          background: "#02343F",
          foreground: "#F0EDCC",
        },
      }),
    }),
  ],

  // OR 2b) Use it as a plugin -------------------------------
  // plugins: [
  //   require("tailwindcss-shadcn-ui"),
  // ],
};
