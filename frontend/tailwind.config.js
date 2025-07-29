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
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",

        // primary accent
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
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
