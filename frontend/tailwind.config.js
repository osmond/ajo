const { createPreset } = require("tailwindcss-shadcn-ui");

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
        accent: {
          DEFAULT: "#02343F",
          foreground: "#F0EDCC",
        },
      },
    },
  },

  // 2a) Use the shadcn preset (recommended) --------------------
  presets: [
    createPreset(),
  ],

  // OR 2b) Use it as a plugin -------------------------------
  // plugins: [
  //   require("tailwindcss-shadcn-ui"),
  // ],
};
