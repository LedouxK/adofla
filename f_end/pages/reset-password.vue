<template>
  <div class="flex flex-col min-h-screen">
    <!--begin::Authentication - Password reset -->
    <div class="flex flex-col flex-grow bg-center bg-no-repeat bg-contain"
      style="background-image: url(assets/media/illustrations/sketchy-1/14.png)">
      <!--begin::Content-->
      <div class="flex flex-col items-center justify-center p-10 pb-20">
        <!--begin::Logo-->
        <router-link to="/login" class="mb-10 flex items-center justify-center">
          <img alt="Logo" src="/assets/media/logos/Flapi_logo.png" class="h-10 mr-2" />
          <span class="text-xl font-bold">FlapiCMS</span>
        </router-link>
        <!--end::Logo-->
        <!--begin::Wrapper-->
        <div class="w-full max-w-lg bg-white rounded shadow-sm p-10 p-lg-15 mx-auto">
          <!--begin::Form-->
          <form class="w-full" novalidate="novalidate" id="kt_password_reset_form">
            <!--begin::Heading-->
            <div class="text-center mb-10">
              <!--begin::Title-->
              <h1 class="text-gray-900 mb-3 text-2xl font-bold">Réinitialisation du mot de passe</h1>
              <!--end::Title-->
              <!--begin::Link-->
              <div class="text-gray-600 text-lg">Veuillez saisir votre nouveau mot de passe.</div>
              <!--end::Link-->
            </div>
            <!--begin::Heading-->
            <!--begin::Input group-->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
              <div class="relative">
                <input 
                  v-model="password" 
                  :type="showPassword ? 'text' : 'password'" 
                  class="w-full p-2 border rounded-md pr-10" 
                  placeholder="Votre nouveau mot de passe"
                  name="password" 
                  autocomplete="new-password" 
                  required 
                />
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
            
            <div class="mb-8">
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirmation du mot de passe</label>
              <div class="relative">
                <input 
                  v-model="c_password" 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  class="w-full p-2 border rounded-md pr-10" 
                  placeholder="Confirmez votre mot de passe"
                  name="confirm_password" 
                  autocomplete="new-password" 
                  required 
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" @click="showConfirmPassword = !showConfirmPassword">
                  <span class="text-gray-500">
                    <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div v-if="password && c_password && password !== c_password" class="mt-1 text-sm text-red-600">
                Les mots de passe ne correspondent pas
              </div>
            </div>
            <!--end::Input group-->
            <!--begin::Actions-->
            <div class="flex flex-wrap justify-center space-x-3 mt-6">
              <button 
                @click="resetPassword" 
                type="button" 
                :disabled="password !== c_password || !password"
                class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-md transition duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="!loading">Enregistrer</span>
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
            <!--end::Actions-->
          </form>
          <!--end::Form-->
        </div>
        <!--end::Wrapper-->
      </div>
      <!--end::Content-->
      <!--begin::Footer-->
      <div class="flex justify-center items-center p-10">
        <!--begin::Links-->
        <div class="flex items-center font-bold text-base">
          <!-- Footer content -->
        </div>
        <!--end::Links-->
      </div>
      <div class="flex justify-center items-center p-10">
        <!--begin::Links-->
        <div class="flex items-center font-bold text-base">
          <!-- Footer content -->
        </div>
        <!--end::Links-->
      </div>
      <!--end::Footer-->
    </div>
    <!--end::Authentication - Password reset-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: '',
      password: '',
      c_password: '',
      message: '',
      loading: false,
      showPassword: false,
      showConfirmPassword: false,
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
    async resetPassword() {
      this.loading = true;
      if (this.password !== this.c_password) {
        this.$Notice.error({
          title: 'Erreur de mot de passe',
          desc: 'Les deux mots de passe ne correspondent pas.',
        });
        this.loading = false;
        return;
      }
      try {
        const axiosInstance = this.createAxiosInstance();
        const response = await axiosInstance.post('/api/resetPassword', {
          token: this.token,
          password: this.password,
        })
        this.message = response.data.message
        this.loading = false;
        this.$Notice.success({
          title: 'Succès',
          desc: 'Votre mot de passe a été réinitialisé avec succès.',
        });
        this.$router.push("/login");
      } catch (error) {
        console.error(error)
        this.message = 'Échec de la réinitialisation'
        this.$Notice.error({
          title: 'Échec de la réinitialisation',
          desc: 'Une erreur est survenue. Veuillez réessayer.',
        });
        this.loading = false;
      }
    }
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    this.token = urlParams.get('token');

    if (!this.token) {
      console.error("Token not found in the URL");
      // Optionally, redirect the user or show an error
      this.$router.push("/login");
    }
  }
}
</script>