/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#14141A",
          deep: "#0C0C10",
          light: "#1E1E27",
        },
        ivory: {
          DEFAULT: "#F2EFE9",
          dim: "#C7C2B6",
        },
        amber: {
          DEFAULT: "#E8A33D",
          light: "#F2BC66",
        },
        slate: {
          DEFAULT: "#4A6FA5",
          light: "#6E8FC0",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
