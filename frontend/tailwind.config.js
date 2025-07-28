const { createPreset } = require("tailwindcss-shadcn-ui");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  presets: [createPreset()],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#02343F",
          foreground: "#F0EDCC",
        },
      },
    },
  },
};
