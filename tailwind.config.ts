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
          50: "#f7f4ee",
          100: "#efe8dc",
          200: "#ddd2c1"
        },
        ink: {
          900: "#13181d",
          800: "#1d252d",
          700: "#334150",
          600: "#4d5e71"
        },
        line: "#d3c8b8",
        sage: "#326553",
        amber: "#97733d",
        rust: "#9b4a3e",
        sky: "#35526b"
      },
      boxShadow: {
        panel: "0 22px 60px -36px rgba(19, 24, 29, 0.35)",
        inset: "inset 0 1px 0 rgba(255, 255, 255, 0.4)"
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
          "linear-gradient(to right, rgba(51, 65, 80, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(51, 65, 80, 0.07) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
