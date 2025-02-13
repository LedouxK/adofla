<template>
  <div class="d-flex flex-column flex-root">
    <!--begin::Authentication - Password reset -->
    <div
      class="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed"
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
              <h1 class="text-dark mb-3">Reset Password</h1>
              <!--end::Title-->
              <!--begin::Link-->
              <div class="text-gray-400 fw-bold fs-4">Enter your new password.</div>
              <!--end::Link-->
            </div>
            <!--begin::Heading-->
            <!--begin::Input group-->
            <div class="fv-row mb-10">
              <label class="form-label fw-bolder text-gray-900 fs-6">Password</label>
              <input v-model="password" class="form-control form-control-solid" type="password" placeholder=""
                name="email" autocomplete="off" />
            </div>
            <div class="fv-row mb-10">
              <label class="form-label fw-bolder text-gray-900 fs-6">Confim Password</label>
              <input v-model="c_password" class="form-control form-control-solid" type="password" placeholder=""
                name="email" autocomplete="off" />
            </div>
            <!--end::Input group-->
            <!--begin::Actions-->
            <div class="d-flex flex-wrap justify-content-center pb-lg-0">
              <button @click="resetPassword" type="button" id="kt_password_reset_submit"
                class="btn btn-lg btn-primary fw-bolder me-4">
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
export default {
  data() {
    return {
      token: '',
      password: '',
      c_password: '',
      message: '',
      loading: false,
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
          title: 'Password Mismatch',
          desc: 'Confirm Password is not matched.',
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
          title: 'Success',
          desc: this.message,
        });
        this.$router.push("/login");
      } catch (error) {
        console.error(error)
        this.message = 'Failed to reset password.'
        this.$Notice.error({
          title: 'Failed to reset password.',
          desc: 'Something went wrong. Please try again.',
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