module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Matches all React files in the src folder
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
