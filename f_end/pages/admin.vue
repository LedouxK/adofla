<script setup lang="ts">
import { useBasicStore } from '@/stores/basic'
import changePassword from '@/components/changePassword.vue'
import { useRouter } from 'vue-router'
import { Users, LogOut, Lock, Database, Sun, Moon } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

const basicStore = useBasicStore()
const router = useRouter()

const { isDark, toggleTheme, initTheme } = useTheme()
onMounted(() => initTheme())

const logOut = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('authUser')
  router.push('/login').then(() => window.location.reload())
}
</script>

<template>
  <div class="flex h-screen bg-accent/10 dark:bg-gray-900 dark:text-white">
    <!-- Sidebar -->
    <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm hidden md:flex flex-col justify-between">
      <div>
        <router-link to="/admin" class="flex items-center px-6 py-4 text-2xl font-bold text-primary dark:text-white">
          <img src="/assets/media/logos/Flapi_logo.png" alt="Logo" class="w-6 h-6 mr-2" />
          FlapiCMS
        </router-link>
        <nav class="px-4">
          <h2 class="text-xs font-semibold text-gray-400 uppercase mt-4 mb-2 tracking-widest dark:text-gray-300">Modules</h2>
          <ul class="space-y-1">
            <li>
              <router-link to="/admin/userUpdate" class="flex items-center gap-2 px-4 py-2 rounded hover:bg-accent/40 dark:hover:bg-gray-700 text-gray-700 dark:text-white">
                <Users class="w-4 h-4 text-primary" />
                <span class="text-sm">Mise à jour utilisateurs</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/userSubscription" class="flex items-center gap-2 px-4 py-2 rounded hover:bg-accent/40 dark:hover:bg-gray-700 text-gray-700 dark:text-white">
                <Database class="w-4 h-4 text-primary" />
                <span class="text-sm">Abonnements utilisateurs</span>
              </router-link>
            </li>
            <li>
              <a @click.prevent="basicStore.changeModel(true)" class="flex items-center gap-2 px-4 py-2 rounded hover:bg-accent/40 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-white">
                <Lock class="w-4 h-4 text-primary" />
                <span class="text-sm">Changer le mot de passe</span>
              </a>
            </li>
            <li>
              <a @click.prevent="logOut" class="flex items-center gap-2 px-4 py-2 rounded hover:bg-red-100 text-red-600 cursor-pointer">
                <LogOut class="w-4 h-4" />
                <span class="text-sm">Déconnexion</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <footer class="text-xs text-gray-400 text-center p-4 dark:text-gray-300">
        2024© <a href="" target="_blank" class="hover:text-primary">Keenthemes</a>
      </footer>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-xl font-semibold text-primary dark:text-white">Tableau de bord</h1>
        <button @click="toggleTheme" class="flex items-center gap-2 text-sm text-primary hover:underline dark:text-accent">
          <component :is="isDark ? Sun : Moon" class="w-4 h-4" />
          {{ isDark ? 'Mode clair' : 'Mode sombre' }}
        </button>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto px-6 py-4">
        <router-view />
      </main>
    </div>

    <!-- Password Modal -->
    <Modal 
      title="Changer votre mot de passe" 
      v-model="basicStore.model"
      :styles="{ top: '20px' }"
      width="600"
      footer-hide
    >
      <changePassword />
    </Modal>
  </div>
</template>

<style scoped>
a {
  cursor: pointer;
}
</style>