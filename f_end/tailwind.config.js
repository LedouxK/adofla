/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6', // Violet moyen (logo)
        accent: '#E3D5FF',  // Violet clair (logo)
      },
    },
  },
  plugins: [],
}
