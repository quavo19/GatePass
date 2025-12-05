/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: "#020887",
          "blue-hover": "#01065a",
          "blue-active": "#01044d",
        },
      },
    },
  },
  plugins: [],
};
