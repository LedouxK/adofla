import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', ()=>{
    const res = ref({})
    function createAxiosInstance() {
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
      }
    async function changePassword(data) {
            const axiosInstance = createAxiosInstance();
            const response = await axiosInstance.post('/api/changePassword', data)
            res.value = response
    }

    return { changePassword }
})