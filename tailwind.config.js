/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yg: "#ceec97",
        or: "#f4b393",
        pi: "#fecde4",
        pu: "#7a28cb",
        da: "#494368",
      },
    },
  },
  plugins: [],
};
