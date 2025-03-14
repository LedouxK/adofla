<template>
  <div class="flex flex-col min-h-screen">
    <!--begin::Authentication - Password reset -->
    <div
      class="flex flex-col flex-grow bg-center bg-no-repeat bg-contain"
      style="background-image: url(assets/media/illustrations/sketchy-1/14.png)">
      <!--begin::Content-->
      <div class="flex flex-col items-center justify-center p-10 pb-20">
        <!--begin::Logo and App Name-->
        <router-link to="#" class="mb-12 flex items-center">
          <img alt="Logo" src="@/public/assets/media/logos/Flapi_logo.png" class="h-10 mr-3" />
          <span class="text-black font-bold text-xl">FlapiCMS</span>
        </router-link>
        <!--end::Logo and App Name-->
        <!--begin::Wrapper-->
        <div class="w-full max-w-lg bg-white rounded shadow-sm p-10 lg:p-15 mx-auto">
          <!--begin::Form-->
          <form class="w-full" novalidate="novalidate" id="kt_password_reset_form">
            <!--begin::Heading-->
            <div class="text-center mb-10">
              <!--begin::Title-->
              <h1 class="text-gray-900 mb-3 text-2xl font-bold">Change Password</h1>
              <!--end::Title-->
              <!--begin::Link-->
              <div class="text-gray-500 font-bold text-lg">Enter your new password.</div>
              <!--end::Link-->
            </div>
            <!--begin::Heading-->
            <!--begin::Input group-->
            <div class="mb-10">
              <label class="block form-label font-bold text-gray-900 text-base mb-2">Current Password</label>
              <input v-model="current_password" class="w-full p-2 border rounded-md bg-gray-50" type="password" placeholder="Current Password"
                name="password" autocomplete="off" />
            </div>
            <div class="mb-10">
              <label class="block form-label font-bold text-gray-900 text-base mb-2">New Password</label>
              <input v-model="new_password" class="w-full p-2 border rounded-md bg-gray-50" type="password" placeholder="New Password"
                name="password" autocomplete="off" />
            </div>
            <div class="mb-10">
              <label class="block form-label font-bold text-gray-900 text-base mb-2">Confirm Password</label>
              <input v-model="confirm_password" class="w-full p-2 border rounded-md bg-gray-50" type="password" placeholder="Confirm Password"
                name="password" autocomplete="off" />
            </div>
            <!--end::Input group-->
            <!--begin::Actions-->
            <div class="flex flex-wrap justify-center pb-0">
              <button @click="changePassword" type="button" id="kt_password_reset_submit"
                class="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
                <span v-if="!loading" class="indicator-label">Submit</span>
                <span v-else class="indicator-label">Please wait...
                  <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin align-middle ml-2"></span></span>
              </button>
              <!-- <router-link to="/login" class="btn bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded">Cancel</router-link> -->
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