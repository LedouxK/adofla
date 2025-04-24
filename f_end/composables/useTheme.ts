import { ref, onMounted } from 'vue'

export const useTheme = () => {
  const isDark = ref(false)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  const initTheme = () => {
    const saved = localStorage.getItem('theme')
    isDark.value = saved === 'dark'
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  onMounted(initTheme)

  return { isDark, toggleTheme, initTheme }
}
