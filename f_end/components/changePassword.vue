<template>
  <div class="max-w-md mx-auto bg-white rounded-lg overflow-hidden">
    <!--Logo et titre-->
    <div class="text-center mb-6">
      <img alt="Logo" src="@/public/assets/media/logos/Flapi_logo.png" class="h-10 mx-auto" />
      <h1 class="text-gray-900 mt-3 text-xl font-bold">Changer votre mot de passe</h1>
      <p class="text-gray-500 text-sm mt-1">Assurez-vous d'utiliser un mot de passe sécurisé</p>
    </div>

    <!--Formulaire-->
    <form class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
        <input 
          v-model="current_password" 
          type="password" 
          class="w-full p-2 border rounded-md bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500" 
          placeholder="Votre mot de passe actuel"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
        <input 
          v-model="new_password" 
          type="password" 
          class="w-full p-2 border rounded-md bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500" 
          placeholder="Votre nouveau mot de passe"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
        <input 
          v-model="confirm_password" 
          type="password" 
          class="w-full p-2 border rounded-md bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500" 
          placeholder="Confirmez votre mot de passe"
        />
      </div>

      <div class="pt-2">
        <button 
          @click.prevent="changePassword" 
          type="button"
          class="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center"
          :disabled="loading"
        >
          <span v-if="loading" class="mr-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ loading ? 'Traitement en cours...' : 'Changer mon mot de passe' }}
        </button>
      </div>
    </form>

    <!--Indicateurs de force du mot de passe (optionnel)-->
    <div class="mt-4">
      <div class="flex items-center mt-1">
        <div class="text-xs text-gray-600">Force du mot de passe :</div>
        <div class="ml-2 h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full transition-all duration-300"
            :class="{
              'w-1/4 bg-red-500': passwordStrength === 'weak',
              'w-2/4 bg-yellow-500': passwordStrength === 'medium',
              'w-3/4 bg-blue-500': passwordStrength === 'strong',
              'w-full bg-green-500': passwordStrength === 'very-strong',
              'w-0': !new_password
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useBasicStore } from '../stores/basic'

export default {
  setup() {
    const basicStore = useBasicStore()
    return { basicStore }
  },
  data() {
    return {
      token: '',
      current_password: '',
      new_password: '',
      confirm_password: '',
      message: '',
      loading: false,
    }
  },
  computed: {
    passwordStrength() {
      if (!this.new_password) return '';
      
      const length = this.new_password.length;
      const hasLower = /[a-z]/.test(this.new_password);
      const hasUpper = /[A-Z]/.test(this.new_password);
      const hasDigit = /\d/.test(this.new_password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(this.new_password);
      
      const score = [length >= 8, hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;
      
      if (score <= 2) return 'weak';
      if (score === 3) return 'medium';
      if (score === 4) return 'strong';
      return 'very-strong';
    }
  },
  methods: {
    createAxiosInstance() {
      if (process.client) {
        const axiosBase = localStorage.getItem("axiosBase");
        const authToken = localStorage.getItem("authToken");
        return axios.create({
          baseURL: axiosBase,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      }
      return axios; // Default Axios instance for SSR
    },
    async changePassword() {
      this.loading = true;
      if (this.new_password !== this.confirm_password) {
        this.$Notice.error({
          title: 'Erreur',
          desc: 'Les mots de passe ne correspondent pas.',
        });
        this.loading = false;
        return;
      }
      
      if (this.new_password.length < 8) {
        this.$Notice.error({
          title: 'Mot de passe trop court',
          desc: 'Votre mot de passe doit comporter au moins 8 caractères.',
        });
        this.loading = false;
        return;
      }
      
      try {
        const axiosInstance = this.createAxiosInstance();
        const response = await axiosInstance.post('/api/changePassword', {
          current_password: this.current_password,
          new_password: this.new_password,
          confirm_password: this.confirm_password,
        })
        this.message = response.data.message
        this.loading = false;
        this.$Notice.success({
          title: 'Succès',
          desc: this.message,
        });
        this.basicStore.changeModel(false)
        this.current_password = ""
        this.new_password = ""
        this.confirm_password = ""
      } catch (error) {
        console.error(error)
        this.message = 'Échec de la modification du mot de passe.'
        this.$Notice.error({
          title: 'Erreur',
          desc: error.response?.data?.message || 'Une erreur est survenue lors du changement de mot de passe.',
        });
        this.loading = false;
      }
    }
  },
  mounted() {
    // Focus sur le premier champ au chargement
    setTimeout(() => {
      const inputElement = document.querySelector('input[type="password"]');
      if (inputElement) {
        inputElement.focus();
      }
    }, 100);
  }
}
</script>