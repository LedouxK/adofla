<template>
    <div class="d-flex flex-column flex-root">
      <!--begin::Authentication - Password reset -->
      <div
        class="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed"
        style="background-image: url(assets/media/illustrations/sketchy-1/14.png)">
        <!--begin::Content-->
        <div class="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20">
          <!--begin::Logo and App Name-->
        <router-link to="#" class="mb-12 d-flex align-items-center">
          <img alt="Logo" src="@/public/assets/media/logos/Flapi_logo.png" class="h-40px me-3" />
          <span class="text-black fw-bold fs-3">FlapiCMS</span>
        </router-link>
        <!--end::Logo and App Name-->
          <!--begin::Wrapper-->
          <div class="w-lg-500px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto">
            <!--begin::Form-->
            <form class="form w-100" novalidate="novalidate" id="kt_password_reset_form">
              <!--begin::Heading-->
              <div class="text-center mb-10">
                <!--begin::Title-->
                <h1 class="text-dark mb-3">Change Password</h1>
                <!--end::Title-->
                <!--begin::Link-->
                <div class="text-gray-400 fw-bold fs-4">Enter your new password.</div>
                <!--end::Link-->
              </div>
              <!--begin::Heading-->
              <!--begin::Input group-->
              <div class="fv-row mb-10">
                <label class="form-label fw-bolder text-gray-900 fs-6">Current Password</label>
                <input v-model="current_password" class="form-control form-control-solid" type="password" placeholder="Current Password"
                  name="password" autocomplete="off" />
              </div>
              <div class="fv-row mb-10">
                <label class="form-label fw-bolder text-gray-900 fs-6">New Password</label>
                <input v-model="new_password" class="form-control form-control-solid" type="password" placeholder="New Password"
                  name="password" autocomplete="off" />
              </div>
              <div class="fv-row mb-10">
                <label class="form-label fw-bolder text-gray-900 fs-6">Confirm Password</label>
                <input v-model="confirm_password" class="form-control form-control-solid" type="password" placeholder="Confirm Password"
                  name="password" autocomplete="off" />
              </div>
              <!--end::Input group-->
              <!--begin::Actions-->
              <div class="d-flex flex-wrap justify-content-center pb-lg-0">
                <button @click="changePassword" type="button" id="kt_password_reset_submit"
                  class="btn btn-lg btn-primary fw-bolder me-4">
                  <span v-if="!loading" class="indicator-label">Submit</span>
                  <span v-else class="indicator-label">Please wait...
                    <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                </button>
                <!-- <router-link to="/login" class="btn btn-lg btn-light-primary fw-bolder">Cancel</router-link> -->
              </div>
              <!--end::Actions-->
            </form>
            <!--end::Form-->
          </div>
          <!--end::Wrapper-->
        </div>
        <!--end::Content-->
      </div>
      <!--end::Authentication - Password reset-->
    </div>
  </template>

<script>
import { useBasicStore } from '../stores/basic'

export default {
  setup() {
        const basicStore = useBasicStore()
        return { basicStore }
    },
  data() {
    return {
      token: '',
      current_password: '',
      new_password: '',
      confirm_password: '',
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
    async changePassword() {
      this.loading = true;
      if (this.new_password !== this.confirm_password) {
        this.$Notice.error({
          title: 'Password Mismatch',
          desc: 'Confirm Password is not matched.',
        });
        this.loading = false;
        return;
      }
      try {
        const axiosInstance = this.createAxiosInstance();
        const response = await axiosInstance.post('/api/changePassword', {
          current_password: this.current_password,
          new_password: this.new_password,
          confirm_password: this.confirm_password,
        })
        this.message = response.data.message
        this.loading = false;
        this.$Notice.success({
          title: 'Success',
          desc: this.message,
        });
        this.basicStore.changeModel(false)
        this.current_password = ""
        this.new_password = ""
        this.confirm_password = ""
        // this.$router.push("/login");
      } catch (error) {
        console.error(error)
        this.message = 'Failed to reset password.'
        this.$Notice.error({
          title: 'Failed to reset password.',
          desc: error.response.data.message,
        });
        this.loading = false;
      }
    }
  },
  mounted() {
  }
}
</script>