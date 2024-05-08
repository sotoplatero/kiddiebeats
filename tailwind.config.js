/** @type {import('tailwindcss').Config} */
export default {
  darkMode: '',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {}
  },
  plugins: [
    require('daisyui'),
  ]
};