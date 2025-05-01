<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md">
      <!-- Email Verification Box -->
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="text-center p-5 pt-10">
          <a href="/" class="text-2xl font-bold flex items-center justify-center">
            <img src="/assets/media/logos/Flapi_logo.png" alt="Logo" class="h-8 mr-2" />
            <span class="font-bold">FlapiCMS</span>
          </a>
        </div>
        
        <div class="p-8">
          <!-- En cours de vérification -->
          <div v-if="status === 'verifying'" class="text-center">
            <div class="flex justify-center mb-6">
              <svg class="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 class="text-xl font-semibold mb-2">Vérification en cours...</h2>
            <p class="text-gray-600">
              Nous vérifions votre adresse email. Merci de patienter un instant.
            </p>
          </div>
          
          <!-- Succès -->
          <div v-if="status === 'success'" class="text-center">
            <div class="flex justify-center mb-6">
              <div class="bg-green-100 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 class="text-xl font-semibold mb-2">Email vérifié avec succès !</h2>
            <p class="text-gray-600 mb-6">
              Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter à votre compte.
            </p>
            <router-link 
              to="/login" 
              class="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-center"
            >
              Se connecter
            </router-link>
          </div>
          
          <!-- Erreur -->
          <div v-if="status === 'error'" class="text-center">
            <div class="flex justify-center mb-6">
              <div class="bg-red-100 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 class="text-xl font-semibold mb-2">Erreur de vérification</h2>
            <p class="text-gray-600 mb-6">
              {{ errorMessage || "Le lien de vérification est invalide ou a expiré." }}
            </p>
            
            <div class="space-y-4">
              <button 
                v-if="hasEmail"
                @click="resendVerificationEmail" 
                :disabled="isLoading"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md mb-2 flex items-center justify-center"
              >
                <span v-if="isLoading" class="mr-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isLoading ? 'Envoi en cours...' : 'Renvoyer l\'email de vérification' }}
              </button>
              
              <router-link 
                to="/login" 
                class="block w-full bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md text-center hover:bg-gray-300"
              >
                Retour à la connexion
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "verify-email",
  data() {
    return {
      status: 'verifying', // verifying, success, error
      errorMessage: '',
      isLoading: false,
      email: ''
    };
  },
  computed: {
    hasEmail() {
      return !!this.email;
    }
  },
  methods: {
    createAxiosInstance() {
      return axios.create({
        baseURL: process.env.VUE_APP_API_URL || "http://localhost:3333",
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
    },
    async verifyEmail(token) {
      try {
        const axiosInstance = this.createAxiosInstance();
        const response = await axiosInstance.get(`/api/auth/verify-email/${token}`);
        
        this.status = 'success';
        
        // Si l'API renvoie l'email de l'utilisateur, le stocker
        if (response.data && response.data.email) {
          this.email = response.data.email;
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'email:", error);
        
        this.status = 'error';
        this.errorMessage = error.response?.data?.message || "Le lien de vérification est invalide ou a expiré.";
        
        // Si l'API renvoie l'email de l'utilisateur malgré l'erreur, le stocker
        if (error.response?.data?.email) {
          this.email = error.response.data.email;
        }
      }
    },
    async resendVerificationEmail() {
      if (!this.email) return;
      
      this.isLoading = true;
      
      try {
        const axiosInstance = this.createAxiosInstance();
        const response = await axiosInstance.post("/api/auth/resend-verification", { email: this.email });
        
        // Rediriger vers la page de notification avec l'email
        this.$router.push({
          path: "/verify-email-notice", 
          query: { email: this.email }
        });
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'email de vérification:", error);
        
        // Afficher une notification d'erreur
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50';
        notification.textContent = error.response?.data?.message || "Une erreur est survenue lors de l'envoi de l'email. Veuillez réessayer.";
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.remove();
        }, 5000);
      } finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    document.title = "Vérification d'email - FlapiCMS";
    
    // Récupérer le token depuis l'URL
    const token = this.$route.params.token;
    
    if (!token) {
      this.status = 'error';
      this.errorMessage = "Aucun token de vérification n'a été fourni.";
      return;
    }
    
    // Vérifier le token
    this.verifyEmail(token);
  }
};
</script>

<style scoped>
/* Styles propres au composant si nécessaire */
</style>
