import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Color Hunt Palette: https://colorhunt.co/palette/ffced8ffddddfff4deffe8c4
        softpink: {
          50: "#FFF8F9",
          100: "#FFF0F3",
          200: "#FFDDDD", // Color Hunt Palette
          300: "#FFCED8", // Color Hunt Palette
          400: "#F7ABB9",
          500: "#E37F94",
          600: "#C75C73",
          700: "#A84157",
          800: "#863043",
          900: "#5D1E2D",
        },
        softcream: {
          50: "#FFFCF7",
          100: "#FFF8EE",
          200: "#FFF4DE", // Color Hunt Palette
          300: "#FFE8C4", // Color Hunt Palette
          400: "#FAD89E",
          500: "#F2BF72",
        },
        warmcharcoal: {
          500: "#6B5E5B",
          600: "#544947",
          700: "#413836",
          800: "#302827",
          900: "#221C1B",
        },
        brand: {
          50: "#FFF5F7",
          100: "#FFE8EC",
          200: "#FFCED8",
          300: "#F5A8B8",
          400: "#E58396",
          500: "#C9657A",
          600: "#A84D62",
          700: "#8B3B4E",
          800: "#6E2B3C",
          900: "#521D2B",
        },
        // Dark Mode Harmony Tokens (based on #241E20 and user reference image)
        dark: {
          bg: "#241E20",
          card: "#2D2528",
          sidebar: "#1E1719",
          header: "#1E1719",
          border: "#4D383E",
          text: "#FFF0F3",
          muted: "#D4B8BE",
          accent: "#FFB3C6",
        },
      },
    },
  },
  plugins: [],
};
export default config;
