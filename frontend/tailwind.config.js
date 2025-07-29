const { createPreset, defineTheme } = require("tailwindcss-shadcn-ui");

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Drive dark mode via a “dark” class on <html>
  darkMode: 'class',

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
          light: "#F0EDCC",
          dark: "#02343F",
        },
      },
    },
  },

  // 4. Pull in the shadcn preset for extra utilities/components
  presets: [
    createPreset({
      theme: defineTheme({
        light: {
          background: "#F0EDCC",
          foreground: "#02343F",
          accent: "#02343F",
          accentForeground: "#F0EDCC",
        },
        dark: {
          background: "#02343F",
          foreground: "#F0EDCC",
          accent: "#F0EDCC",
          accentForeground: "#02343F",
        },
      }),
    }),
  ],
};
