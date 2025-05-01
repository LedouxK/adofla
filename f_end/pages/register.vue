<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-lg">
      <!-- Register Box -->
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="text-center p-5 pt-10">
          <a href="/" class="text-2xl font-bold flex items-center justify-center">
            <img src="/assets/media/logos/Flapi_logo.png" alt="Logo" class="h-8 mr-2" />
            <span class="font-bold">FlapiCMS</span>
          </a>
        </div>
        <div class="p-6">
          <h2 class="text-xl font-semibold text-center mb-1">Inscription</h2>
          <p class="text-center text-gray-600 mb-4">Créez un compte pour accéder à la plateforme</p>

          <form @submit.prevent="register">
            <!-- Prénom -->
            <div class="mb-4 relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <div class="relative">
                <input 
                  v-model="user.first_name" 
                  type="text" 
                  class="w-full p-2 border rounded-md pr-10" 
                  placeholder="Votre prénom"
                  required
                >
                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span class="text-gray-500">
                    <i class="fas fa-user"></i>
                  </span>
                </div>
              </div>
              <div v-if="errors.first_name" class="text-red-500 text-xs mt-1">{{ errors.first_name }}</div>
            </div>
            
            <!-- Nom -->
            <div class="mb-4 relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <div class="relative">
                <input 
                  v-model="user.last_name" 
                  type="text" 
                  class="w-full p-2 border rounded-md pr-10" 
                  placeholder="Votre nom"
                  required
                >
                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span class="text-gray-500">
                    <i class="fas fa-user"></i>
                  </span>
                </div>
              </div>
              <div v-if="errors.last_name" class="text-red-500 text-xs mt-1">{{ errors.last_name }}</div>
            </div>
            
            <!-- Email -->
            <div class="mb-4 relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
              <div class="relative">
                <input 
                  v-model="user.email" 
                  type="email" 
                  class="w-full p-2 border rounded-md pr-10" 
                  placeholder="Votre adresse email"
                  required
                >
                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span class="text-gray-500">
                    <i class="fas fa-envelope"></i>
                  </span>
                </div>
              </div>
              <div v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</div>
            </div>
            
            <!-- Mot de passe -->
            <div class="mb-4 relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div class="relative">
                <input 
                  v-model="user.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  class="w-full p-2 border rounded-md pr-10 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500" 
                  placeholder="Votre mot de passe"
                  required
                >
                <button 
                  @click="showPassword = !showPassword"
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
              <div v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</div>
              
              <!-- Règles de mot de passe -->
              <div class="mt-1 text-xs text-gray-500">
                <p>Le mot de passe doit contenir au moins :</p>
                <ul class="list-disc pl-4 mt-1 space-y-1">
                  <li :class="{ 'text-green-600 font-semibold': user.password.length >= 8 }">8 caractères</li>
                  <li :class="{ 'text-green-600 font-semibold': /[A-Z]/.test(user.password) }">Une majuscule</li>
                  <li :class="{ 'text-green-600 font-semibold': /[a-z]/.test(user.password) }">Une minuscule</li>
                  <li :class="{ 'text-green-600 font-semibold': /\d/.test(user.password) }">Un chiffre</li>
                  <li :class="{ 'text-green-600 font-semibold': hasSpecialChar }">Un caractère spécial</li>
                </ul>
              </div>
              
              <!-- Indicateur de force du mot de passe -->
              <div v-if="user.password" class="mt-3">
                <div class="flex items-center justify-between mb-1">
                  <div class="text-xs font-medium">Force du mot de passe</div>
                  <div class="text-xs font-medium" :class="{
                    'text-red-600': passwordStrength < 2,
                    'text-yellow-600': passwordStrength === 2,
                    'text-green-600': passwordStrength > 2
                  }">
                    {{ passwordStrengthText }}
                  </div>
                </div>
                <div class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all duration-300" 
                    :class="{
                      'bg-red-500': passwordStrength === 1,
                      'bg-yellow-500': passwordStrength === 2,
                      'bg-green-500': passwordStrength >= 3
                    }"
                    :style="{ width: (passwordStrength / 4 * 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
            
            <!-- Confirmation de Mot de passe -->
            <div class="mb-6 relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
              <div class="relative">
                <input 
                  v-model="user.password_confirmation" 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  class="w-full p-2 border rounded-md pr-10 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500" 
                  :class="{'border-red-500': confirmError, 'border-green-500': user.password_confirmation && user.password_confirmation === user.password}"
                  placeholder="Confirmez votre mot de passe"
                  required
                >
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
              <div v-if="errors.password_confirmation" class="text-red-500 text-xs mt-1">{{ errors.password_confirmation }}</div>
              <p v-else-if="confirmError" class="mt-1 text-sm text-red-600">Les mots de passe ne correspondent pas</p>
              <p v-else-if="user.password_confirmation && user.password_confirmation === user.password" class="mt-1 text-sm text-green-600">Les mots de passe correspondent</p>
            </div>
            
            <!-- Conditions d'utilisation -->
            <div class="mb-6">
              <div class="flex items-center">
                <input 
                  v-model="acceptTerms" 
                  type="checkbox" 
                  id="terms" 
                  class="mr-2"
                  required
                >
                <label for="terms" class="text-sm text-gray-700">
                  J'accepte les <a href="#" class="text-indigo-600 hover:text-indigo-800">conditions d'utilisation</a> et la <a href="#" class="text-indigo-600 hover:text-indigo-800">politique de confidentialité</a>
                </label>
              </div>
              <div v-if="errors.terms" class="text-red-500 text-xs mt-1">{{ errors.terms }}</div>
            </div>

            <!-- Bouton d'inscription -->
            <div class="text-center">
              <button 
                type="submit" 
                :disabled="isLoading"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
              >
                <span v-if="isLoading" class="mr-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isLoading ? 'Inscription en cours...' : 'S\'inscrire' }}
              </button>
            </div>
          </form>

          <!-- Lien de connexion -->
          <div class="text-center mt-6 border-t pt-4">
            <p class="text-sm text-gray-600 mb-2">Vous avez déjà un compte ?</p>
            <router-link to="/login" class="block w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium transition duration-200">
              <i class="fas fa-sign-in-alt mr-1"></i> Se connecter
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "register",
  data() {
    return {
      user: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: ""
      },
      acceptTerms: false,
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      errors: {}
    };
  },
  computed: {
    confirmError() {
      return this.user.password_confirmation && 
this.user.password !== this.user.password_confirmation;
    },
    passwordStrength() {
      let strength = 0;
      const password = this.user.password;

      if (!password) return 0;
      
      // Longueur minimum
      if (password.length >= 8) strength += 1;
      
      // Contient des lettres minuscules
      if (/[a-z]/.test(password)) strength += 1;
      
      // Contient des lettres majuscules
      if (/[A-Z]/.test(password)) strength += 1;
      
      // Contient des chiffres
      if (/\d/.test(password)) strength += 1;
      
      // Contient des caractères spéciaux
      if (this.hasSpecialChar) strength += 1;
      
      return Math.min(strength, 4);
    },
    passwordStrengthText() {
      const strength = this.passwordStrength;
      
      if (strength === 0) return "Très faible";
      if (strength === 1) return "Faible";
      if (strength === 2) return "Moyen";
      if (strength === 3) return "Fort";
      return "Très fort - Excellente sécurité";
    },
    hasSpecialChar() {
      return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.user.password);
    },
  },
  methods: {
    createAxiosInstance() {
      return axios.create({
        baseURL: "http://localhost:3333",
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        withCredentials: true
      });
    },
    validateForm() {
      this.errors = {};
      let isValid = true;

      if (!this.user.first_name.trim()) {
        this.errors.first_name = "Le prénom est requis";
        isValid = false;
      }

      if (!this.user.last_name.trim()) {
        this.errors.last_name = "Le nom est requis";
        isValid = false;
      }

      if (!this.user.email.trim()) {
        this.errors.email = "L'adresse email est requise";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.email)) {
        this.errors.email = "Veuillez entrer une adresse email valide";
        isValid = false;
      }

      if (!this.user.password) {
        this.errors.password = "Le mot de passe est requis";
        isValid = false;
      } else if (this.user.password.length < 8) {
        this.errors.password = "Le mot de passe doit contenir au moins 8 caractères";
        isValid = false;
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(this.user.password)) {
        this.errors.password = "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre";
        isValid = false;
      }

      if (this.user.password !== this.user.password_confirmation) {
        this.errors.password_confirmation = "Les mots de passe ne correspondent pas";
        isValid = false;
      }

      if (!this.acceptTerms) {
        this.errors.terms = "Vous devez accepter les conditions d'utilisation";
        isValid = false;
      }

      return isValid;
    },
    async register() {
      if (!this.validateForm()) return;
      
      this.isLoading = true;
      
      try {
        this.errors = {}; // Réinitialiser les erreurs
        const axiosInstance = this.createAxiosInstance();
        console.log('Envoi des données:', this.user);
        const response = await axiosInstance.post("/api/auth/register", this.user);
        console.log('Réponse du serveur:', response.data);
        
        // Redirection vers une page de confirmation
        this.$router.push({
          path: "/verify-email-notice", 
          query: { email: this.user.email }
        });
      } catch (error) {
        console.error("Erreur d'inscription:", error);
        this.isLoading = false;
        
        // Affichage d'une notification d'erreur générale en haut de la page
        const generalError = document.createElement('div');
        generalError.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50';
        generalError.textContent = "Erreur lors de l'inscription";
        document.body.appendChild(generalError);
        
        setTimeout(() => {
          generalError.remove();
        }, 5000);
        
        if (error.response && error.response.data) {
          // Gestion des erreurs retournées par l'API
          if (error.response.data.field && error.response.data.message) {
            this.errors[error.response.data.field] = error.response.data.message;
          } else if (error.response.data.message) {
            // Ajouter le message d'erreur spécifique du serveur au message général
            alert(error.response.data.message);
          }
        } else {
          // Afficher le détail de l'erreur pour le débogage
          console.log('Détail de l\'erreur:', error.message || 'Erreur inconnue');
        }
      } finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    document.title = "Inscription - FlapiCMS";
  }
};
</script>

<style scoped>
/* Styles propres au composant si nécessaire */
</style>
