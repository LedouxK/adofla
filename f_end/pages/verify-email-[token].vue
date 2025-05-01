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
                <svg class="h-12 w-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-5" role="alert">
              <p class="font-bold text-lg">Félicitations !</p>
              <p class="text-base">Votre compte a bien été créé et activé.</p>
            </div>
            
            <h2 class="text-xl font-semibold mb-2">Email vérifié avec succès !</h2>
            <p class="text-gray-600 mb-6">
              Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter à votre compte pour profiter de tous les services de FlapiCMS.
            </p>
            <div class="mt-6">
              <p class="text-gray-700 mb-4 text-sm">Cliquez sur le bouton ci-dessous pour accéder à la page de connexion :</p>
              <button 
                @click="redirectToLogin" 
                class="w-full block bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg focus:outline-none focus:shadow-outline transition text-lg animate-pulse"
              >
                <span class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                  Se connecter maintenant
                </span>
              </button>
            </div>
          </div>
          
          <!-- Erreur -->
          <div v-if="status === 'error'" class="text-center">
            <div class="flex justify-center mb-6">
              <div class="bg-red-100 rounded-full p-3">
                <svg class="h-12 w-12 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 class="text-xl font-semibold mb-2">Vérification échouée</h2>
            <p class="text-gray-600 mb-2">
              {{ errorMessage }}
            </p>
            
            <div v-if="hasEmail" class="mt-6 border-t pt-6">
              <p class="text-sm text-gray-600 mb-4">Vous n'avez pas reçu d'email de vérification ou le lien a expiré ?</p>
              <button 
                @click="resendVerificationEmail" 
                class="text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none"
                :disabled="isResending"
              >
                {{ isResending ? 'Envoi en cours...' : 'Renvoyer l\'email de vérification' }}
              </button>
              
              <div v-if="resendSuccess" class="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
                Email de vérification renvoyé avec succès.
              </div>
              
              <div v-if="resendError" class="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
                {{ resendErrorMessage }}
              </div>
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
  data() {
    return {
      status: "verifying",
      email: "",
      errorMessage: "Le lien de vérification est invalide ou a expiré.",
      isResending: false,
      resendSuccess: false,
      resendError: false,
      resendErrorMessage: "",
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
        baseURL: "http://localhost:3333",
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        withCredentials: true
      });
    },
    async verifyEmail(token) {
      try {
        const axiosInstance = this.createAxiosInstance();
        const response = await axiosInstance.get(`/api/auth/verify-email/${token}`);
        
        // Passer au statut de succès
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
      
      this.isResending = true;
      this.resendSuccess = false;
      this.resendError = false;
      
      try {
        const axiosInstance = this.createAxiosInstance();
        await axiosInstance.post("/api/auth/resend-verification", { email: this.email });
        
        this.resendSuccess = true;
        this.resendError = false;
      } catch (error) {
        console.error("Erreur lors du renvoi de l'email de vérification:", error);
        
        this.resendError = true;
        this.resendSuccess = false;
        this.resendErrorMessage = error.response?.data?.message || "Une erreur est survenue lors du renvoi de l'email.";
      } finally {
        this.isResending = false;
      }
    },
    
    // Méthode pour rediriger vers la page de connexion avec un message de succès
    redirectToLogin() {
      // Stocker l'information de vérification dans localStorage
      if (process.client) {
        localStorage.setItem('emailVerified', 'true');
        // Expiration dans 1 minute
        localStorage.setItem('emailVerifiedExpiry', (Date.now() + 60000).toString());
      }
      
      // Rediriger vers la page de connexion
      this.$router.push('/login');
    }
  },
  mounted() {
    // Récupérer le token depuis les paramètres d'URL
    const token = this.$route.params.token;
    
    if (token) {
      // Vérifier l'email avec le token fourni
      this.verifyEmail(token);
    } else {
      // Si pas de token, afficher une erreur
      this.status = 'error';
      this.errorMessage = "Aucun token de vérification fourni.";
    }
  }
};
</script>

<style scoped>
/* Styles propres au composant si nécessaire */
</style>
