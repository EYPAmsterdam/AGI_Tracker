import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: "rgb(var(--paper-50) / <alpha-value>)",
          100: "rgb(var(--paper-100) / <alpha-value>)",
          200: "rgb(var(--paper-200) / <alpha-value>)"
        },
        ink: {
          900: "rgb(var(--ink-900) / <alpha-value>)",
          800: "rgb(var(--ink-800) / <alpha-value>)",
          700: "rgb(var(--ink-700) / <alpha-value>)",
          600: "rgb(var(--ink-600) / <alpha-value>)"
        },
        line: "rgb(var(--line) / <alpha-value>)",
        sage: "rgb(var(--sage) / <alpha-value>)",
        amber: "rgb(var(--amber) / <alpha-value>)",
        rust: "rgb(var(--rust) / <alpha-value>)",
        sky: "rgb(var(--sky) / <alpha-value>)"
      },
      boxShadow: {
        panel: "0 22px 60px -36px rgb(var(--shadow-panel-rgb) / 0.35)",
        inset: "inset 0 1px 0 rgb(var(--shadow-inset-rgb) / 0.4)"
      },
      fontFamily: {
        sans: [
          "\"IBM Plex Sans\"",
          "\"Segoe UI Variable Text\"",
          "\"Segoe UI\"",
          "sans-serif"
        ],
        serif: [
          "\"Iowan Old Style\"",
          "\"Palatino Linotype\"",
          "\"Book Antiqua\"",
          "serif"
        ]
      },
      backgroundImage: {
        lattice:
          "linear-gradient(to right, rgb(var(--lattice-rgb) / 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--lattice-rgb) / 0.07) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
