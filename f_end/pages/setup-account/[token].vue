<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md">
      <!-- Configuration Box -->
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="text-center p-5 pt-15">
          <a href="/" class="text-2xl font-bold flex items-center justify-center">
            <img src="/assets/media/logos/Flapi_logo.png" alt="Logo" class="h-8 mr-2" />
            <span class="font-bold">FlapiCMS</span>
          </a>
        </div>
        <div class="p-6">
          <h2 class="text-xl font-semibold text-center mb-4">Configuration de votre compte</h2>
          <p class="text-center mb-6 text-gray-600">Veuillez choisir un mot de passe pour finaliser la création de votre compte.</p>

          <!-- Message d'erreur éventuel -->
          <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded mb-4">
            {{ error }}
          </div>

          <!-- Message de succès -->
          <div v-if="success" class="bg-green-50 text-green-600 p-3 rounded mb-4">
            {{ success }}
            <div class="mt-2">
              <router-link to="/login" class="text-blue-600 hover:underline">Se connecter</router-link>
            </div>
          </div>

          <form v-if="!success" @submit.prevent="setupAccount">
            <!-- Champ email (non modifiable) -->
            <div class="mb-4" v-if="userEmail">
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                :value="userEmail"
                disabled
                class="w-full p-2 border rounded-md bg-gray-50 text-gray-500"
              />
            </div>

            <!-- Champ mot de passe -->
            <div class="mb-4 relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
              <div class="relative">
                <input 
                  v-model="password" 
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full p-2 border rounded-md" 
                  placeholder="Choisissez un mot de passe sécurisé"
                  :class="{'border-red-300': passwordError}"
                  required
                />
                <button 
                  @click.prevent="showPassword = !showPassword" 
                  type="button" 
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <!-- Messages d'erreur pour le mot de passe -->
              <div v-if="passwordError" class="mt-1 text-sm text-red-600">
                {{ passwordError }}
              </div>
            </div>

            <!-- Critères de mot de passe -->
            <div class="mb-4 p-3 bg-gray-50 rounded-md">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Le mot de passe doit contenir au moins :</h3>
              <ul class="text-xs space-y-1">
                <li :class="passwordLength ? 'text-green-600' : 'text-gray-500'">
                  <span>✓</span> 8 caractères
                </li>
                <li :class="hasUppercase ? 'text-green-600' : 'text-gray-500'">
                  <span>✓</span> Une majuscule
                </li>
                <li :class="hasLowercase ? 'text-green-600' : 'text-gray-500'">
                  <span>✓</span> Une minuscule
                </li>
                <li :class="hasNumber ? 'text-green-600' : 'text-gray-500'">
                  <span>✓</span> Un chiffre
                </li>
                <li :class="hasSpecial ? 'text-green-600' : 'text-gray-500'">
                  <span>✓</span> Un caractère spécial
                </li>
              </ul>
            </div>

            <!-- Confirmation du mot de passe -->
            <div class="mb-4 relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirmez le mot de passe</label>
              <div class="relative">
                <input 
                  v-model="confirmPassword" 
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="w-full p-2 border rounded-md" 
                  placeholder="Confirmez votre mot de passe"
                  :class="{'border-red-300': confirmError}"
                  required
                />
                <button 
                  @click.prevent="showConfirmPassword = !showConfirmPassword" 
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
              <!-- Message d'erreur pour la confirmation -->
              <div v-if="confirmError" class="mt-1 text-sm text-red-600">
                Les mots de passe ne correspondent pas
              </div>
              <div v-else-if="confirmPassword && confirmPassword === password" class="mt-1 text-sm text-green-600">
                Les mots de passe correspondent
              </div>
            </div>

            <!-- Message explicatif pour validation -->
            <div class="mb-4 px-3 py-2 bg-blue-50 rounded text-sm text-blue-700" v-if="password && !isPasswordValid">
              <p>Veuillez respecter tous les critères de sécurité avant de valider.</p>
            </div>
            <div class="mb-4 px-3 py-2 bg-blue-50 rounded text-sm text-blue-700" v-if="password && confirmPassword && !passwordsMatch">
              <p>Les deux mots de passe doivent être identiques.</p>
            </div>
            
            <!-- Bouton de soumission (toujours visible) -->
            <button 
              type="submit" 
              class="w-full py-3 px-4 rounded-md font-medium transition duration-200 flex justify-center items-center mb-2"
              :class="{
                'bg-indigo-600 hover:bg-indigo-700 text-white': isPasswordValid && passwordsMatch,
                'bg-gray-300 text-gray-700 cursor-not-allowed': !isPasswordValid || !passwordsMatch || loading
              }"
              :disabled="loading || !isPasswordValid || !passwordsMatch"
            >
              <span v-if="loading" class="mr-2">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading ? 'Configuration en cours...' : 'Configurer mon compte' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SetupAccount',
  data() {
    return {
      token: '',
      userEmail: '',
      password: '',
      confirmPassword: '',
      loading: false,
      error: '',
      success: '',
      showPassword: false,
      showConfirmPassword: false,
      passwordError: ''
    };
  },
  computed: {
    // Vérifications de la robustesse du mot de passe
    passwordLength() {
      return this.password.length >= 8;
    },
    hasUppercase() {
      return /[A-Z]/.test(this.password);
    },
    hasLowercase() {
      return /[a-z]/.test(this.password);
    },
    hasNumber() {
      return /\d/.test(this.password);
    },
    hasSpecial() {
      return /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
    },
    isPasswordValid() {
      return this.passwordLength && this.hasUppercase && this.hasLowercase && this.hasNumber && this.hasSpecial;
    },
    passwordsMatch() {
      return this.password === this.confirmPassword && this.password !== '';
    },
    confirmError() {
      return this.confirmPassword && this.password !== this.confirmPassword;
    }
  },
  methods: {
    createAxiosInstance() {
      return axios.create({
        baseURL: process.env.NODE_ENV === 'production'
          ? 'https://api.mondomaine.com' // URL de production
          : 'http://localhost:3000' // URL de développement
      });
    },
    async validateToken() {
      // Récupération des informations liées au token d'invitation
      try {
        this.loading = true;
        const axiosInstance = this.createAxiosInstance();
        const response = await axiosInstance.get(`/api/validateToken/${this.token}`);
        
        // Stockage de l'email associé au token
        if (response.data && response.data.email) {
          this.userEmail = response.data.email;
        }
        
        this.loading = false;
      } catch (error) {
        console.error('Erreur lors de la validation du token:', error);
        this.error = error.response?.data?.message || 'Ce lien d\'invitation n\'est plus valide ou a expiré.';
        this.loading = false;
      }
    },
    async setupAccount() {
      // Validation côté client
      if (!this.isPasswordValid) {
        this.passwordError = 'Votre mot de passe ne respecte pas les critères de sécurité.';
        return;
      }
      
      if (!this.passwordsMatch) {
        this.confirmError = true;
        return;
      }
      
      try {
        this.loading = true;
        const axiosInstance = this.createAxiosInstance();
        
        const response = await axiosInstance.post('/api/setupAccount', {
          token: this.token,
          password: this.password
        });
        
        this.success = response.data.message || 'Votre compte a été configuré avec succès. Vous pouvez maintenant vous connecter.';
        this.loading = false;
      } catch (error) {
        console.error('Erreur lors de la configuration du compte:', error);
        this.error = error.response?.data?.message || 'Une erreur est survenue lors de la configuration de votre compte.';
        this.loading = false;
      }
    }
  },
  mounted() {
    // Récupération du token depuis l'URL
    this.token = this.$route.params.token;
    
    // Validation du token
    if (this.token) {
      this.validateToken();
    } else {
      this.error = 'Token d\'invitation manquant.';
    }
  }
};
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>
