<template>
  <div>
    <!-- Toolbar -->
    <div class="bg-white dark:bg-gray-800 shadow-sm p-4 mb-6">
      <div class="container mx-auto flex flex-wrap justify-between items-center">
        <div class="flex items-center mb-3 md:mb-0">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
            Gestion des utilisateurs
            <button 
              @click="addModalOn" 
              class="ml-2 py-1 px-3 bg-[#7B68EE] hover:bg-[#6A5ACD] text-white text-sm font-medium rounded transition duration-200"
            >
              Ajouter un utilisateur
            </button>
          </h1>
        </div>
        <div class="flex py-1">
          <nav class="text-sm">
            <ol class="list-none p-0 inline-flex">
              <li class="flex items-center">
                <a href="/admin" class="text-gray-600 dark:text-gray-300 hover:text-blue-600">Accueil</a>
                <svg class="h-3 w-3 mx-2 fill-current text-gray-400 dark:text-gray-500" viewBox="0 0 320 512">
                  <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c-9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c-9.373 9.372-9.373 24.568-.001 33.941z" />
                </svg>
              </li>
              <li class="text-gray-500 dark:text-gray-400">Mise à jour utilisateurs</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="p-5">
      <div class="container mx-auto">
        <div ref="focusForm" class="w-full px-5">
          <!-- Modal Backdrop -->
          <div v-if="addModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center" @click="addModal = false"></div>
          
          <!-- Modal -->
          <div v-if="addModal" class="fixed inset-x-0 top-[10vh] mx-auto z-50 w-full max-w-2xl">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden" @click.stop>
              <!-- Modal Header -->
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ form.id ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur' }}</h3>
                <button @click="addModal = false" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <!-- Modal Body -->
              <div class="p-6">
                <form @submit.prevent="form.id ? updateUser() : addUser()" class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <input
                        id="email"
                        v-model="form.email"
                        type="email"
                        placeholder="Entrez l'email"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                      <p v-if="!form.id" class="mt-1 text-xs text-gray-500 dark:text-gray-400">Un email d'invitation sera envoyé à l'utilisateur</p>
                    </div>
                    <div>
                      <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type d'utilisateur</label>
                      
                      <!-- Champ mot de passe uniquement visible en mode édition -->
                      <div v-if="form.id" class="mb-4">
                        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe (uniquement en modification)</label>
                        <input
                          id="password"
                          v-model="form.password"
                          type="password"
                          placeholder="Laisser vide pour ne pas modifier"
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <select 
                        id="role" 
                        v-model="form.role_id" 
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="1">Admin</option>
                        <option value="2">User</option>
                      </select>
                    </div>
                  </div>
                  <div class="flex justify-end items-center gap-4 pt-6">
                    <button 
                      type="button"
                      @click="addModal = false" 
                      class="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition duration-200"
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit"
                      class="flex items-center justify-center px-4 py-2 rounded-md transition duration-200"
                      :class="[
                        loading ? 'opacity-75 cursor-not-allowed' : '',
                        form.id ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'
                      ]"
                      :disabled="loading"
                    >
                      <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ form.id ? 'Modifier' : 'Ajouter' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortTable('id')">
                    ID
                    <span class="ml-1">↕</span>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortTable('email')">
                    Email
                    <span class="ml-1">↕</span>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortTable('role_id')">
                    Type d'utilisateur
                    <span class="ml-1">↕</span>
                  </th>
                  <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody v-if="!tblloading" class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="row in usersData" :key="row.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                    {{ row.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ row.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <span class="font-medium">{{ row.userRole.roleName }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <button 
                      @click="editUser(row)"
                      class="mx-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition duration-200"
                    >
                      Modifier
                    </button>
                    <button 
                      @click="removeUser(row)"
                      class="mx-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition duration-200"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="4" class="px-6 py-4 text-center dark:text-gray-300">
                    <div class="flex justify-center items-center">
                      <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span class="ml-2">Chargement...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="paginationInfo" class="flex justify-center items-center mt-4">
            <nav class="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="loadUsers(paginationInfo.currentPage - 1)"
                :disabled="paginationInfo.currentPage === 1"
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium',
                  paginationInfo.currentPage === 1 
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed bg-white dark:bg-gray-800' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800'
                ]"
              >
                <span class="sr-only">Précédent</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <template v-for="page in getPaginationRange()" :key="page">
                <button
                  @click="loadUsers(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium',
                    page === paginationInfo.currentPage
                      ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-300'
                      : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                  ]"
                >
                  {{ page }}
                </button>
              </template>
              
              <button
                @click="loadUsers(paginationInfo.currentPage + 1)"
                :disabled="paginationInfo.currentPage === paginationInfo.lastPage"
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium',
                  paginationInfo.currentPage === paginationInfo.lastPage 
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed bg-white dark:bg-gray-800' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800'
                ]"
              >
                <span class="sr-only">Suivant</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4-4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'user',
  data() {
    return {
      addModal: false,
      loading: false,
      tblloading: false,
      form: {
        id: '',
        email: '',
        password: '',
        role_id: 2,
      },
      usersData: [],
      paginationInfo: null,
      per_page: 5,
      sortKey: 'id',
      sortDirection: 'asc'
    }
  },
  methods: {
    createAxiosInstance() {
      if (process.client) {
        const axiosBase = localStorage.getItem('axiosBase')
        const authToken = localStorage.getItem('authToken')
        return axios.create({
          baseURL: axiosBase,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
      }
      return axios
    },

    async loadUsers(page_number = 1) {
      if (page_number < 1 || (this.paginationInfo && page_number > this.paginationInfo.lastPage)) {
        return;
      }
      
      const axiosInstance = this.createAxiosInstance()
      try {
        this.tblloading = true
        const res = await axiosInstance.get('/api/users', {
          params: { 
            page: page_number, 
            per_page: this.per_page,
            sort: this.sortKey,
            direction: this.sortDirection
          },
        })
        this.usersData = res.data.data
        this.paginationInfo = res.data.meta
      } catch (error) {
        console.error('Error loading users:', error)
      } finally {
        this.tblloading = false
      }
    },

    editUser(user) {
      this.form = {
        id: user.id,
        email: user.email,
        password: '',
        role_id: user.role_id,
      }
      this.addModal = true
    },

    async updateUser() {
      if (this.hasEmptyFields()) return
      this.loading = true
      const axiosInstance = this.createAxiosInstance()
      try {
        await axiosInstance.put(`/api/users/${this.form.id}`, this.form)
        this.loadUsers()
        this.resetForm()
        this.addModal = false
        
        // Notification de succès
        this.$Notice.success({
          title: 'Utilisateur modifié',
          desc: 'Les informations de l\'utilisateur ont été mises à jour avec succès.'
        })
      } catch (error) {
        console.error('Erreur lors de la modification de l\'utilisateur:', error)
        
        // Notification d'erreur
        this.$Notice.error({
          title: 'Erreur',
          desc: 'Impossible de modifier l\'utilisateur. Veuillez réessayer.'
        })
      } finally {
        this.loading = false
      }
    },

    async addUser() {
      if (this.hasEmptyFields()) return
      this.loading = true
      const axiosInstance = this.createAxiosInstance()
      try {
        const response = await axiosInstance.post('/api/users', this.form)
        this.loadUsers()
        this.resetForm()
        this.addModal = false
        
        // Message de succès indiquant l'envoi d'email
        this.$Notice.success({
          title: 'Utilisateur ajouté',
          desc: 'Un email d\'invitation a été envoyé à l\'utilisateur pour qu\'il puisse configurer son compte.',
          duration: 6
        })
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur:', error)
        const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de la création de l\'utilisateur.'
        this.$Notice.error({
          title: 'Erreur',
          desc: errorMessage
        })
      } finally {
        this.loading = false
      }
    },

    async removeUser(row) {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return
      const axiosInstance = this.createAxiosInstance()
      try {
        await axiosInstance.delete(`/api/users/${row.id}`)
        this.usersData = this.usersData.filter(user => user.id !== row.id)
        
        // Notification de succès
        this.$Notice.success({
          title: 'Utilisateur supprimé',
          desc: 'L\'utilisateur a été supprimé avec succès.'
        })
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error)
        
        // Notification d'erreur
        this.$Notice.error({
          title: 'Erreur',
          desc: 'Impossible de supprimer l\'utilisateur. Veuillez réessayer.'
        })
      }
    },

    resetForm() {
      this.form = { id: '', email: '', password: '', role_id: 2 }
    },

    hasEmptyFields() {
      if (!this.form.email) {
        alert('L\'email est requis')
        return true
      }
      // Vérification du mot de passe uniquement en mode édition
      if (this.form.id && this.form.password && this.form.password.length < 8) {
        alert('Le mot de passe doit contenir au moins 8 caractères')
        return true
      }
      if (!this.form.role_id) {
        alert('Le type d\'utilisateur est requis')
        return true
      }
      return false
    },

    addModalOn() {
      this.resetForm()
      this.addModal = true
    },

    sortTable(key) {
      if (this.sortKey === key) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortKey = key
        this.sortDirection = 'asc'
      }
      this.loadUsers()
    },

    getPaginationRange() {
      if (!this.paginationInfo) return []
      
      const current = this.paginationInfo.currentPage
      const last = this.paginationInfo.lastPage
      const delta = 2
      const range = []
      
      for (let i = Math.max(1, current - delta); i <= Math.min(last, current + delta); i++) {
        range.push(i)
      }
      
      return range
    }
  },

  definePageMeta() {
    return {
      middleware: [
        function () {
          if (process.client) {
            const token = localStorage.getItem('authToken')
            const storedUser = JSON.parse(localStorage.getItem('authUser'))
            if (!token || storedUser?.user?.roleId !== 1) {
              return navigateTo('/login')
            }
          }
        },
      ],
    }
  },

  mounted() {
    if (process.client) this.loadUsers()
  },
}
</script>
