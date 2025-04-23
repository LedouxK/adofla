<script setup lang="ts">
import { useBasicStore } from '@/stores/basic'
import changePassword from '@/components/changePassword.vue'
import { useRouter } from 'vue-router'
import { Users, LogOut, Lock, Database } from 'lucide-vue-next'

const basicStore = useBasicStore()
const router = useRouter()

const logOut = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('authUser')
  router.push('/login').then(() => window.location.reload())
}
</script>

<template>
  <div class="flex h-screen bg-accent/10">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 shadow-sm hidden md:flex flex-col justify-between">
      <div>
        <router-link to="/admin" class="flex items-center px-6 py-4 text-2xl font-bold text-primary">
          <img src="/assets/media/logos/Flapi_logo.png" alt="Logo" class="w-6 h-6 mr-2" />
          FlapiCMS
        </router-link>
        <nav class="px-4">
          <h2 class="text-xs font-semibold text-gray-400 uppercase mt-4 mb-2 tracking-widest">Modules</h2>
          <ul class="space-y-1">
            <li>
              <router-link to="/admin/userUpdate" class="flex items-center gap-2 px-4 py-2 rounded hover:bg-accent/40 text-gray-700">
                <Users class="w-4 h-4 text-primary" />
                <span class="text-sm">Users Update</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/userSubscription" class="flex items-center gap-2 px-4 py-2 rounded hover:bg-accent/40 text-gray-700">
                <Database class="w-4 h-4 text-primary" />
                <span class="text-sm">User Subscriptions</span>
              </router-link>
            </li>
            <li>
              <a @click.prevent="basicStore.changeModel(true)" class="flex items-center gap-2 px-4 py-2 rounded hover:bg-accent/40 cursor-pointer text-gray-700">
                <Lock class="w-4 h-4 text-primary" />
                <span class="text-sm">Change Password</span>
              </a>
            </li>
            <li>
              <a @click.prevent="logOut" class="flex items-center gap-2 px-4 py-2 rounded hover:bg-red-100 text-red-600 cursor-pointer">
                <LogOut class="w-4 h-4" />
                <span class="text-sm">Log Out</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <footer class="text-xs text-gray-400 text-center p-4">
        2024© <a href="" target="_blank" class="hover:text-primary">Keenthemes</a>
      </footer>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white shadow-sm px-6 py-4 flex items-center border-b border-gray-200">
        <h1 class="text-xl font-semibold text-primary">Dashboard</h1>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto px-6 py-4">
        <router-view />
      </main>
    </div>

    <!-- Password Modal -->
    <Modal okText="Back" width="600" title="Change Password" v-model="basicStore.model">
      <changePassword />
    </Modal>
  </div>
</template>

<style scoped>
a {
  cursor: pointer;
}
</style>
