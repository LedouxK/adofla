/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.{js,vue,ts}",
    "./pages/**/*.{js,vue,ts}",
    "./plugins/**/*.{js,vue,ts}",
    "./composables/**/*.{js,ts}",
    "./stores/**/*.{js,ts}",
    "./modules/**/*.{js,ts,vue}",
    "./app.vue",
    "./error.vue",
    "./utils/**/*.{js,ts}",
    "./assets/**/*.{css,scss}",
    // Suppression du pattern problématique qui scannait tous les fichiers, y compris node_modules
  ],
  darkMode: 'class', // ✅ Mode sombre basé sur la classe .dark
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6', // Violet moyen
        accent: '#E3D5FF',  // Violet clair
      },
      borderWidth: {
        '5': '5px',
      },
    },
  },
  plugins: [],
}
