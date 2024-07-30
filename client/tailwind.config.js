/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#d2d2d1",
        background: "#091235",
        primary: "#070F2B",
        secondary: "#D0B89D",
        accent: "#59C1EA",
      },
      fontFamily: {
        heading: "Poppins",
        subheading: "Montserrat"
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

