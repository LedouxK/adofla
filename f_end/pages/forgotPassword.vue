<template>
  <div class="flex flex-col min-h-screen">
    <!-- Begin Authentication - Password reset -->
    <div class="flex flex-col flex-grow bg-center bg-no-repeat bg-contain"
      style="background-image: url(assets/media/illustrations/sketchy-1/14.png)">
      
      <!-- Begin Content -->
      <div class="flex flex-col items-center justify-center p-10 pb-20">
        <!-- Begin Logo -->
        <router-link to="/login" class="mb-12">
          <img alt="Logo" src="@/public/assets/media/logos/Flapi_logo.png" class="h-10" />
        </router-link>
        <!-- End Logo -->
        
        <!-- Begin Wrapper -->
        <div class="w-full max-w-lg bg-white rounded shadow-sm p-10 lg:p-15 mx-auto">
          <!-- Begin Form -->
          <form class="w-full" novalidate="novalidate" id="kt_password_reset_form">
            <!-- Begin Heading -->
            <div class="text-center mb-10">
              <!-- Begin Title -->
              <h1 class="text-gray-900 mb-3 text-2xl font-bold">Forgot Password ?</h1>
              <!-- End Title -->
              <!-- Begin Link -->
              <div class="text-gray-500 font-bold text-lg">Enter your email to reset your password.</div>
              <!-- End Link -->
            </div>
            <!-- Begin Heading -->
            
            <!-- Begin Input group -->
            <div class="mb-10">
              <label class="form-label font-bold text-gray-900 text-base">Email</label>
              <input v-model="user.email" class="w-full p-2 border rounded-md bg-gray-50" type="email" placeholder="" name="email" autocomplete="off" />
            </div>
            <!-- End Input group -->
            
            <!-- Begin Actions -->
            <div class="flex flex-wrap justify-center pb-lg-0">
              <button @click="resetPassword" type="button" id="kt_password_reset_submit" class="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
                <span v-if="!loading" class="indicator-label">Submit</span>
                <span v-else class="indicator-label">Please wait...
                <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin align-middle ml-2"></span></span>
              </button>
              <router-link to="/login" class="btn bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded">Cancel</router-link>
            </div>
            <!-- End Actions -->
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
  name: "login",
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
            // Notify success
            this.$Notice.success({
              title: 'Success',
              desc: res.data.message,
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
        // Notify error
        this.$Notice.error({
          title: 'Error',
          desc: 'Something went wrong. Please try again.',
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