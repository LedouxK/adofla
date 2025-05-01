<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md">
      <!-- Login Box -->
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="text-center p-5 pt-15">
          <a href="/" class="text-2xl font-bold flex items-center justify-center">
            <img src="/assets/media/logos/Flapi_logo.png" alt="Logo" class="h-8 mr-2" />
            <span class="font-bold">FlapiCMS</span>
          </a>
        </div>
        <div class="p-6">
          <!-- Message de confirmation d'activation de compte -->
          <div v-if="accountActivated" class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-5 animate-pulse" role="alert">
            <p class="font-bold text-lg">Félicitations !</p>
            <p class="text-base">Votre compte a bien été créé et activé. Vous pouvez maintenant vous connecter.</p>
          </div>
          
          <h2 class="text-xl font-semibold text-center mb-1">Connexion</h2>
          <p class="text-center text-gray-600 mb-4">Connectez-vous pour accéder à votre compte</p>

          <!-- Message de succès après vérification d'email -->
          <div v-if="emailVerified" class="mb-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-md shadow-sm">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="font-medium">Votre adresse email a été vérifiée avec succès !</span>
            </div>
            <p class="mt-1 text-sm">Vous pouvez maintenant vous connecter à votre compte pour profiter de tous les services de FlapiCMS.</p>
          </div>

          <form @submit.prevent="prelogin()">
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
            </div>
            
            <!-- Mot de passe -->
            <div class="mb-4 relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div class="relative">
                <input 
                  v-model="user.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  class="w-full p-2 border rounded-md pr-10" 
                  placeholder="Votre mot de passe"
                  required
                >
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" @click="showPassword = !showPassword">
                  <span class="text-gray-500">
                    <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Rester connecté et bouton de connexion -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <input type="checkbox" id="remember" class="mr-2">
                <label for="remember" class="text-sm text-gray-700">
                  Rester connecté
                </label>
              </div>
              <Button 
                type="primary" 
                htmlType="submit" 
                :loading="loading" 
                class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
              >
                {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
              </Button>
            </div>
          </form>

          <!-- Mot de passe oublié et inscription -->
          <div class="text-center mt-6 border-t pt-4">
            <p class="text-sm text-gray-600 mb-2">Vous avez oublié votre mot de passe ?</p>
            <router-link to="/forgotPassword" class="block w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium transition duration-200 mb-3">
              <i class="fas fa-key mr-1"></i> Réinitialiser le mot de passe
            </router-link>
            
            <p class="text-sm text-gray-600 mb-2 mt-4">Vous n'avez pas encore de compte ?</p>
            <router-link to="/register" class="block w-full py-2 px-4 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 font-medium transition duration-200">
              <i class="fas fa-user-plus mr-1"></i> Créer un compte
            </router-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import axiosInstance from '@/utils/axios';

export default {
  name: "login",
  data() {
    return {
      loading: false,
      showPassword: false,
      emailVerified: false,
      accountActivated: false,
      user: {
        email: "",
        password: "",
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

    async prelogin() {
      try {
        this.loading = true;

        // Create Axios instance and send login request
        const axiosInstance = this.createAxiosInstance();
        const res = await axiosInstance.post("/api/login", this.user);

        // Check for successful login response
        if (res.status === 200 && res.data.token) {
          localStorage.setItem("authToken", res.data.token);
          this.login();
        }
      } catch (error) {
        console.error("Error during login:", error);
        this.loading = false;
        // Notification d'erreur en français
        this.$Notice.error({
          title: 'Échec de connexion',
          desc: 'Une erreur est survenue. Veuillez réessayer.',
        });
      }
    },
    // Login function
    async login() {
      try {
        this.loading = true;

        // Create Axios instance and send login request
        const axiosInstance = this.createAxiosInstance();
        const res = await axiosInstance.post("/api/login", this.user);
        this.loading = false;
        // Check for successful login response
        if (res.status === 200 && res.data.token) {
          // Save token to local storage
          localStorage.setItem("authToken", res.data.token);

          // Fetch authenticated user info
          const authUserResponse = await axiosInstance.get("/api/authUser");
          if (authUserResponse.status === 200 && authUserResponse.data.user) {
            // Save authenticated user info to local storage
            localStorage.setItem("authUser", JSON.stringify(authUserResponse.data));

            // Notification de succès en français
            this.$Notice.success({
              title: 'Connexion réussie',
              desc: 'Vous êtes maintenant connecté !',
            });

            // Redirect based on user role
            const userRole = authUserResponse.data.user.roleId;
            this.loading = false;
            if (userRole === 1) {
              // this.$router.push("/admin");
              this.$router.push("/admin").then(() => {
                window.location.reload();
              });
            } else {
              // this.$router.push("/");
              this.$router.push("/").then(() => {
                window.location.reload();
              });
            }
            return;
          }
        }

        // If login fails or token is missing
        throw new Error("Invalid login or token not found");
      } catch (error) {
        console.error("Error during login:", error);
        this.loading = false;
        // Notification d'erreur en français
        this.$Notice.error({
          title: 'Échec de connexion',
          desc: 'Une erreur est survenue. Veuillez réessayer.',
        });
      } finally {
        // Ensure loading is turned off
        this.loading = false;
      }
    }

  },
  mounted() {
    document.title = "Login";
    
    // Vérifier si le compte vient d'être activé via le paramètre URL
    if (this.$route.query.accountActivated === 'true') {
      console.log('Compte activé avec succès, affichage du message');
      this.accountActivated = true;
      
      // Nettoyer l'URL
      if (history.pushState) {
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.pushState({ path: newUrl }, '', newUrl);
      }
      
      // Pré-remplir l'email s'il est fourni
      if (this.$route.query.email) {
        this.user.email = this.$route.query.email;
      }
      
      // Faire disparaître le message après 10 secondes
      setTimeout(() => {
        this.accountActivated = false;
      }, 10000);
    }
  },
};
</script>

<style scoped>
/* Styles propres au composant si nécessaire */
</style>