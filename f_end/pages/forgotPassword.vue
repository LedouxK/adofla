<template>
    <div class="d-flex flex-column flex-root">
			<!--begin::Authentication - Password reset -->
			<div class="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed" 
      style="background-image: url(assets/media/illustrations/sketchy-1/14.png)">
				<!--begin::Content-->
				<div class="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20">
					<!--begin::Logo-->
					<router-link to="/login" class="mb-12">
						<img alt="Logo" src="@/public/assets/media/logos/Flapi_logo.png" class="h-40px" />
					</router-link>
					<!--end::Logo-->
					<!--begin::Wrapper-->
					<div class="w-lg-500px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto">
						<!--begin::Form-->
						<form class="form w-100" novalidate="novalidate" id="kt_password_reset_form">
							<!--begin::Heading-->
							<div class="text-center mb-10">
								<!--begin::Title-->
								<h1 class="text-dark mb-3">Forgot Password ?</h1>
								<!--end::Title-->
								<!--begin::Link-->
								<div class="text-gray-400 fw-bold fs-4">Enter your email to reset your password.</div>
								<!--end::Link-->
							</div>
							<!--begin::Heading-->
							<!--begin::Input group-->
							<div class="fv-row mb-10">
								<label class="form-label fw-bolder text-gray-900 fs-6">Email</label>
								<input v-model="user.email" class="form-control form-control-solid" type="email" placeholder="" name="email" autocomplete="off" />
							</div>
							<!--end::Input group-->
							<!--begin::Actions-->
							<div class="d-flex flex-wrap justify-content-center pb-lg-0">
								<button @click="resetPassword" type="button" id="kt_password_reset_submit" class="btn btn-lg btn-primary fw-bolder me-4">
									<span v-if="!loading" class="indicator-label">Submit</span>
									<span v-else class="indicator-label">Please wait...
									<span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
								</button>
								<router-link to="/login" class="btn btn-lg btn-light-primary fw-bolder">Cancel</router-link>
							</div>
							<!--end::Actions-->
						</form>
						<!--end::Form-->
					</div>
					<!--end::Wrapper-->
				</div>
				<!--end::Content-->
        
      <!--begin::Footer-->
      <div class="d-flex flex-center flex-column-auto p-10">
        <!--begin::Links-->
        <div class="d-flex align-items-center fw-bold fs-6">
          <!-- <a href="https://keenthemes.com" class="text-muted text-hover-primary px-2">About</a>
          <a href="mailto:support@keenthemes.com" class="text-muted text-hover-primary px-2">Contact</a>
          <a href="https://1.envato.market/EA4JP" class="text-muted text-hover-primary px-2">Contact Us</a> -->
        </div>
        <!--end::Links-->
      </div>
      <div class="d-flex flex-center flex-column-auto p-10">
        <!--begin::Links-->
        <div class="d-flex align-items-center fw-bold fs-6">
          <!-- <a href="https://keenthemes.com" class="text-muted text-hover-primary px-2">About</a>
          <a href="mailto:support@keenthemes.com" class="text-muted text-hover-primary px-2">Contact</a>
          <a href="https://1.envato.market/EA4JP" class="text-muted text-hover-primary px-2">Contact Us</a> -->
        </div>
        <!--end::Links-->
      </div>
      <!--end::Footer-->
			</div>
			<!--end::Authentication - Password reset-->
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