<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md">
      <!-- Email Verification Notice Box -->
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="text-center p-5 pt-10">
          <a href="/" class="text-2xl font-bold flex items-center justify-center">
            <img src="/assets/media/logos/Flapi_logo.png" alt="Logo" class="h-8 mr-2" />
            <span class="font-bold">FlapiCMS</span>
          </a>
        </div>
        <div class="p-8">
          <div class="flex justify-center mb-6">
            <div class="bg-indigo-100 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <h2 class="text-xl font-semibold text-center mb-2">Vérifiez votre adresse email</h2>
          <p class="text-center text-gray-600 mb-6">
            Nous avons envoyé un email à <strong>{{ email }}</strong> avec un lien pour vérifier votre adresse email.
          </p>
          
          <div class="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6 rounded-r-md">
            <p class="text-indigo-800 text-sm">
              <strong>Important :</strong> Vous devez vérifier votre adresse email avant de pouvoir vous connecter. Si vous ne trouvez pas l'email dans votre boîte de réception, n'oubliez pas de vérifier votre dossier de courrier indésirable.
            </p>
          </div>
          
          <!-- Resend Email button -->
          <button 
            @click="resendVerificationEmail" 
            :disabled="isLoading"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md mb-4 flex items-center justify-center"
          >
            <span v-if="isLoading" class="mr-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Envoi en cours...' : 'Renvoyer l\'email de vérification' }}
          </button>
          
          <!-- Return to login -->
          <div class="text-center pt-4 border-t">
            <router-link to="/login" class="text-indigo-600 hover:text-indigo-800 text-sm">
              Retourner à la page de connexion
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
  name: "verify-email-notice",
  data() {
    return {
      email: '',
      isLoading: false
    };
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
    async resendVerificationEmail() {
      if (!this.email) return;
      
      this.isLoading = true;
      
      try {
        const axiosInstance = this.createAxiosInstance();
        const response = await axiosInstance.post("/api/auth/resend-verification", { email: this.email });
        
        // Afficher une notification de succès
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
        notification.textContent = "Un nouvel email de vérification a été envoyé. Veuillez vérifier votre boîte de réception.";
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.remove();
        }, 5000);
        
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
    // Récupérer l'email depuis les paramètres d'URL
    this.email = this.$route.query.email || '';
    
    if (!this.email) {
      this.$router.push('/login');
    }
    
    document.title = "Vérification d'email - FlapiCMS";
  }
};
</script>

<style scoped>
/* Styles propres au composant si nécessaire */
</style>
