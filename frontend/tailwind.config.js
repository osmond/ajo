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
      colors: {},
    },
  },

  // 2a) Use the shadcn preset (recommended) --------------------
  presets: [
    createPreset({
      theme: defineTheme({
        light: {
          accent: '#02343F',
          accentForeground: '#F0EDCC',
        },
        dark: {
          accent: '#02343F',
          accentForeground: '#F0EDCC',
        },
      }),
    }),
  ],

  // OR 2b) Use it as a plugin -------------------------------
  // plugins: [
  //   require("tailwindcss-shadcn-ui"),
  // ],
};
