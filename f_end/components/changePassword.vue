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
        <div class="relative">
          <input 
            v-model="current_password" 
            :type="showCurrentPassword ? 'text' : 'password'" 
            class="w-full p-2 border rounded-md bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="Votre mot de passe actuel"
          />
          <button 
            @click="showCurrentPassword = !showCurrentPassword" 
            type="button" 
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            <svg v-if="showCurrentPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
        <div class="relative">
          <input 
            v-model="new_password" 
            :type="showNewPassword ? 'text' : 'password'" 
            class="w-full p-2 border rounded-md bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="Votre nouveau mot de passe"
          />
          <button 
            @click="showNewPassword = !showNewPassword" 
            type="button" 
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <!-- Règles de mot de passe -->
        <div class="mt-1 text-xs text-gray-500">
          <p>Le mot de passe doit contenir au moins :</p>
          <ul class="list-disc pl-4 mt-1 space-y-1">
            <li :class="{ 'text-green-600 font-semibold': new_password.length >= 8 }">8 caractères</li>
            <li :class="{ 'text-green-600 font-semibold': /[A-Z]/.test(new_password) }">Une majuscule</li>
            <li :class="{ 'text-green-600 font-semibold': /[a-z]/.test(new_password) }">Une minuscule</li>
            <li :class="{ 'text-green-600 font-semibold': /\d/.test(new_password) }">Un chiffre</li>
            <li :class="{ 'text-green-600 font-semibold': hasSpecialChar }">Un caractère spécial</li>
          </ul>
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
        <div class="relative">
          <input 
            v-model="confirm_password" 
            :type="showConfirmPassword ? 'text' : 'password'" 
            class="w-full p-2 border rounded-md bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500" 
            :class="{'border-red-500': confirmError, 'border-green-500': confirm_password && confirm_password === new_password}"
            placeholder="Confirmez votre mot de passe"
          />
          <button 
            @click="showConfirmPassword = !showConfirmPassword" 
            type="button" 
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <p v-if="confirmError" class="mt-1 text-sm text-red-600">Les mots de passe ne correspondent pas</p>
        <p v-else-if="confirm_password && confirm_password === new_password" class="mt-1 text-sm text-green-600">Les mots de passe correspondent</p>
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

    <!--Indicateurs de force du mot de passe-->
    <div class="mt-4" v-if="new_password">
      <div class="flex items-center">
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
      <div class="mt-1 text-xs" :class="{
        'text-red-500': passwordStrength === 'weak',
        'text-yellow-500': passwordStrength === 'medium',
        'text-blue-500': passwordStrength === 'strong',
        'text-green-500': passwordStrength === 'very-strong'
      }">
        {{ passwordStrengthText }}
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
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
    }
  },
  computed: {
    // Vérification de l'erreur de confirmation
    confirmError() {
      return this.confirm_password && this.confirm_password !== this.new_password;
    },
    
    // Évaluation de la force du mot de passe
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
    },
    
    // Texte descriptif de la force du mot de passe
    passwordStrengthText() {
      switch(this.passwordStrength) {
        case 'weak': return 'Faible - Améliorez votre mot de passe';
        case 'medium': return 'Moyen - Peut être renforcé';
        case 'strong': return 'Fort - Bonne sécurité';
        case 'very-strong': return 'Très fort - Excellente sécurité';
        default: return '';
      }
    },
    
    // Vérifie la présence de caractères spéciaux dans le mot de passe
    hasSpecialChar() {
      return /[!@#$%^&*(),.?":{}|<>]/.test(this.new_password);
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
      
      // Vérification du mot de passe actuel
      if (!this.current_password) {
        this.$Notice.error({
          title: 'Mot de passe actuel requis',
          desc: 'Veuillez saisir votre mot de passe actuel pour confirmer votre identité.',
        });
        this.loading = false;
        return;
      }
      
      // Vérification de la correspondance des mots de passe
      if (this.new_password !== this.confirm_password) {
        this.$Notice.error({
          title: 'Mots de passe différents',
          desc: 'Le nouveau mot de passe et sa confirmation ne correspondent pas.',
        });
        this.loading = false;
        return;
      }
      
      // Vérifications complètes de la robustesse du mot de passe
      const length = this.new_password.length >= 8;
      const hasLower = /[a-z]/.test(this.new_password);
      const hasUpper = /[A-Z]/.test(this.new_password);
      const hasDigit = /\d/.test(this.new_password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(this.new_password);
      
      if (!length || !hasLower || !hasUpper || !hasDigit || !hasSpecial) {
        this.$Notice.error({
          title: 'Mot de passe trop faible',
          desc: 'Votre mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.',
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
          title: 'Mot de passe modifié',
          desc: 'Votre mot de passe a été changé avec succès.',
        });
        this.basicStore.changeModel(false)
        this.current_password = ""
        this.new_password = ""
        this.confirm_password = ""
      } catch (error) {
        console.error(error)
        this.message = 'Échec de la modification du mot de passe.'
        
        // Traduire les messages d'erreur spécifiques de l'API
        let errorMessage = error.response?.data?.message || 'Une erreur système est survenue.'
        
        // Traduire les messages spécifiques d'erreur qui pourraient encore être en anglais
        if (errorMessage === 'Current password is incorrect') {
          errorMessage = 'Le mot de passe actuel est incorrect'
        } else if (errorMessage === 'User not authenticated') {
          errorMessage = 'Utilisateur non authentifié'
        } else if (errorMessage === 'New password and confirmation password do not match') {
          errorMessage = 'Le nouveau mot de passe et sa confirmation ne correspondent pas'
        } else if (errorMessage === 'Failed to change password') {
          errorMessage = 'Impossible de modifier le mot de passe'
        }
        
        this.$Notice.error({
          title: 'Modification impossible',
          desc: errorMessage,
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