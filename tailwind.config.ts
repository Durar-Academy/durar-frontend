import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        orange: "#F38708",
        burnt: "#BD6A08",
        "dark-green": "#132D02",
        green: "#173A01",
        "light-green": "#10A37F",
        success: "#4ACA67",
        teal: "#0954AC",
        danger: "#DD132B",
        high: "#263238",
        low: "#63767E",
        "shade-1": "#F1F1F1",
        "shade-2": "#E6E9F5",
        "shade-3": "#D2D4E0",
        white: "#fff",
        black: "#000"
      },
    },
  },
  plugins: [],
};
export default config;
