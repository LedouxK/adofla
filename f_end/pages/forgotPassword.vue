<template>
  <div class="flex flex-col min-h-screen">
    <!-- Début de l'authentification - Réinitialisation de mot de passe -->
    <div class="flex flex-col flex-grow bg-center bg-no-repeat bg-contain"
      style="background-image: url(assets/media/illustrations/sketchy-1/14.png)">
      
      <!-- Begin Content -->
      <div class="flex flex-col items-center justify-center p-10 pb-20">
        <!-- Begin Logo -->
        <router-link to="/login" class="mb-10 flex items-center justify-center">
          <img alt="Logo" src="/assets/media/logos/Flapi_logo.png" class="h-10 mr-2" />
          <span class="text-xl font-bold">FlapiCMS</span>
        </router-link>
        <!-- End Logo -->
        
        <!-- Begin Wrapper -->
        <div class="w-full max-w-lg bg-white rounded shadow-sm p-10 lg:p-15 mx-auto">
          <!-- Formulaire de réinitialisation -->
          <form class="w-full" @submit.prevent="resetPassword" novalidate="novalidate" id="kt_password_reset_form">
            <!-- Begin Heading -->
            <div class="text-center mb-10">
              <!-- Titre -->
              <h1 class="text-gray-900 mb-3 text-2xl font-bold">Mot de passe oublié ?</h1>
              <!-- Fin du titre -->
              <!-- Message explicatif -->
              <div class="text-gray-600 text-lg">Saisissez votre adresse email pour réinitialiser votre mot de passe.</div>
              <!-- Fin du message explicatif -->
            </div>
            <!-- Begin Heading -->
            
            <!-- Champ email -->
            <div class="mb-8">
              <label class="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
              <div class="relative">
                <input 
                  v-model="user.email" 
                  class="w-full p-2 border rounded-md pr-10" 
                  type="email" 
                  placeholder="Votre adresse email" 
                  name="email" 
                  autocomplete="off"
                  required 
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span class="text-gray-500">
                    <i class="fas fa-envelope"></i>
                  </span>
                </div>
              </div>
            </div>
            <!-- Fin du champ email -->
            
            <!-- Boutons d'action -->
            <div class="flex flex-wrap justify-center space-x-3 mt-6">
              <button 
                @click="resetPassword" 
                type="button" 
                class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-md transition duration-200 flex items-center"
              >
                <span v-if="!loading">Envoyer</span>
                <span v-else class="flex items-center">
                  En cours
                  <svg class="animate-spin h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              </button>
              <router-link to="/login" class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-5 rounded-md transition duration-200">
                Annuler
              </router-link>
            </div>
            <!-- Fin des boutons d'action -->
          </form>
          <!-- End Form -->
        </div>
        <!-- End Wrapper -->
      </div>
      <!-- End Content -->
      
      <!-- Begin Footer -->
      <div class="flex justify-center items-center p-10">
        <!-- Begin Links -->
        <div class="flex items-center font-bold text-base">
          <!-- Footer content -->
        </div>
        <!-- End Links -->
      </div>
      <div class="flex justify-center items-center p-10">
        <!-- Begin Links -->
        <div class="flex items-center font-bold text-base">
          <!-- Footer content -->
        </div>
        <!-- End Links -->
      </div>
      <!-- End Footer -->
    </div>
    <!-- End Authentication - Password reset -->
  </div>
</template>

<script>
import axios from "axios";
// import axiosInstance from '@/utils/axios';

export default {
  name: "forgotPassword",
  data() {
    return {
      loading: false,
      user: {
        email: "",
      },
    };
  },
  methods: {
    // Reusable Axios instance
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
    async resetPassword() {
      try {
        this.loading = true;

        // Create Axios instance and send login request
        const axiosInstance = this.createAxiosInstance();
        const res = await axiosInstance.post("/api/sendResetEmail", this.user);
        
        // Check for successful login response
        if (res.status === 200) {
            // Notification de succès en français
            this.$Notice.success({
              title: 'Demande envoyée',
              desc: 'Un email de réinitialisation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception.',
            });

              this.$router.push("/login");
              // this.$router.push("/").then(() => {
              //   window.location.reload();
              // });
            // return;
          }
          this.loading = false;
      } catch (error) {
        console.error("Error during login:", error);
        this.loading = false;
        // Notification d'erreur en français
        this.$Notice.error({
          title: 'Erreur',
          desc: 'Une erreur est survenue. Veuillez réessayer.',
        });
      } finally {
        // Ensure loading is turned off
        this.loading = false;
      }
    }

  },
  mounted() {
    // console.log("Login component mounted");
  },
};
</script>