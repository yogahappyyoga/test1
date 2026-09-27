import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surf: {
          green: "#1a9850",
          yellow: "#d4a017",
          red: "#d7301f",
        },
      },
    },
  },
  plugins: [],
};

export default config;
