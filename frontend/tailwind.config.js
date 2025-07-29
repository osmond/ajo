const { createPreset } = require("tailwindcss-shadcn-ui");

/** @type {import('tailwindcss').Config} */
module.exports = {

  // 1. Tell Tailwind where to look for your classes
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],

  theme: {
    extend: {
      // 2. Your custom font stack
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },

      // 3. Map semantic Tailwind colors to your CSS variables
      colors: {
        // page-level
        background: "var(--background)",
        foreground: "var(--foreground)",

        // primary accent
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },

        // optional “tone” palette if you still need it
        tone: {
          light: "#ffffff",
          dark: "#000000",
        },
      },
    },
  },

  // 4. Pull in the shadcn preset for extra utilities/components
  presets: [
    createPreset(),
  ],
};
