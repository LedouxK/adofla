<template>
  <div class="hold-transition login-page">
    <div class="login-box">
      <!-- /.login-logo -->
      <div class="card card-outline card-primary">
        <div class="text-center p-5 pt-15">
          <a href="/" class="h1"><b>Sub</b>Manage</a>
        </div>
        <div class="card-body">
          <p class="login-box-msg">Sign in to start your session</p>

          <form action="#">
            <div class="input-group mb-3">
              <input v-model="user.email" type="email" class="form-control" placeholder="Email">
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-envelope"></span>
                </div>
              </div>
            </div>
            <div class="input-group mb-3">
              <input v-model="user.password" type="password" class="form-control" placeholder="Password">
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-lock"></span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-8">
                <div class="icheck-primary">
                  <input type="checkbox" id="remember">
                  <label for="remember">
                    Remember Me
                  </label>
                </div>
              </div>
              <!-- /.col -->
              <div class="col-4">
                <Button @click.prevent="prelogin()" :loading="loading" type="primary" class="btn-primary btn-block">Sign
                  In</Button>
                <!-- <button @click.prevent="login()" type="submit" class="btn btn-primary btn-block">Sign In</button> -->
              </div>
              <!-- /.col -->
            </div>
          </form>

          <div>
            <div class="social-auth-links text-center mt-2 mb-3">
              <router-link to="/forgotPassword" class="btn btn-block btn-danger">
                <Icon type="md-key" /> Forgot Password ?
              </router-link>
            </div>
          </div>

        </div>
        <!-- /.card-body -->
      </div>
      <!-- /.card -->
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
/* Import external styles within the scoped block */
@import "../public/plugins/fontawesome-free/css/all.min.css";
@import "../public/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css";
@import "../public/plugins/icheck-bootstrap/icheck-bootstrap.min.css";
@import "../public/plugins/jqvmap/jqvmap.min.css";
@import "../public/plugins/overlayScrollbars/css/OverlayScrollbars.min.css";
@import "../public/plugins/daterangepicker/daterangepicker.css";
@import "../public/plugins/summernote/summernote-bs4.min.css";
@import "../public/dist/css/adminlte.min.css";
</style>