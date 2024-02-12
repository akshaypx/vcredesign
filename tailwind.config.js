/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-accent": "##2C8C80",
        "primary-background": "#12294B",
      },
    },
  },
  plugins: [],
};
