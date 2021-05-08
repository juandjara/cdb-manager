module.exports = {
  purge: ['./public/**/*.html', './src/**/*.{js,jsx}'],
  variants: {
    extend: {
      ringWidth: ['focus-visible'],
      ringColor: ['focus-visible'],
      ringOpacity: ['focus-visible']
    }
  },
  plugins: [require('@tailwindcss/forms')]
  // specify other options here
}
