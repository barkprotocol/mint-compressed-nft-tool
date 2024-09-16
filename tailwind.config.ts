import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        "18": "72px",
        "192": "768px",
      },
    },
  },
  plugins: [],
} satisfies Config;
