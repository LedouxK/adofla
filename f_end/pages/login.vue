<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md">
      <!-- Login Box -->
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="text-center p-5 pt-15">
          <a href="/" class="text-2xl font-bold"><span class="font-bold">Sub</span>Manage</a>
        </div>
        <div class="p-6">
          <p class="text-center mb-4">Sign in to start your session</p>

          <form action="#">
            <div class="mb-4 relative">
              <input v-model="user.email" type="email" class="w-full p-2 border rounded-md pr-10" placeholder="Email">
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <span class="text-gray-500">
                  <i class="fas fa-envelope"></i>
                </span>
              </div>
            </div>
            <div class="mb-4 relative">
              <input v-model="user.password" type="password" class="w-full p-2 border rounded-md pr-10" placeholder="Password">
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <span class="text-gray-500">
                  <i class="fas fa-lock"></i>
                </span>
              </div>
            </div>
            <div class="flex items-center mb-4">
              <div class="flex-grow">
                <div class="flex items-center">
                  <input type="checkbox" id="remember" class="mr-2">
                  <label for="remember" class="text-sm">
                    Remember Me
                  </label>
                </div>
              </div>
              <div class="">
                <Button @click.prevent="prelogin()" :loading="loading" type="primary" class="btn-primary">
                  Sign In
                </Button>
              </div>
            </div>
          </form>

          <div>
            <div class="text-center mt-4 mb-3">
              <router-link to="/forgotPassword" class="block w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700">
                <Icon type="md-key" /> Forgot Password ?
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
// import axiosInstance from '@/utils/axios';

export default {
  name: "login",
  data() {
    return {
      loading: false,
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
      }catch (error) {
        console.error("Error during login:", error);
        this.loading = false;
        // Notify error
        this.$Notice.error({
          title: 'Login Failed',
          desc: 'Something went wrong. Please try again.',
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

            // Notify success
            this.$Notice.success({
              title: 'Login Success',
              desc: 'You have successfully logged in!',
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
        // Notify error
        this.$Notice.error({
          title: 'Login Failed',
          desc: 'Something went wrong. Please try again.',
        });
      } finally {
        // Ensure loading is turned off
        this.loading = false;
      }
    }

  },
  mounted() {
    console.log("Login component mounted");
  },
};
</script>

<style scoped>
/* Styles propres au composant si nécessaire */
</style>