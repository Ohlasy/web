/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightGray: "#f8f8f8",
        silver: "#ddd",
        gray: "#c0c0c0",
        brown: "#945200",
        offBlack: "#444",
      },
    },
  },
  plugins: [],
};
