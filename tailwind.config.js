module.exports = {
  purge: ['./public/**/*.html', './src/**/*.{js,jsx}'],
  plugins: [
    require('@tailwindcss/forms')
  ]
  // specify other options here
};