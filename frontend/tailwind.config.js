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
    },
  },

  // 2a) Use the shadcn preset (recommended) --------------------
  presets: [
    require("tailwindcss-shadcn-ui").createPreset(),
  ],

  // OR 2b) Use it as a plugin -------------------------------
  // plugins: [
  //   require("tailwindcss-shadcn-ui"),
  // ],
};
