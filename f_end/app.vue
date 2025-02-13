<script setup>
import axios from 'axios';
import { onMounted } from 'vue';
import { useRouter, useRoute  } from 'vue-router';

const router = useRouter();
const route = useRoute();

function createAxiosInstance() {
  if (process.client) {
    const axiosBase = localStorage.getItem('axiosBase');
    const authToken = localStorage.getItem('authToken');
    return axios.create({
      baseURL: axiosBase,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }
  return axios; // Default Axios instance for SSR
}

onMounted(async () => {
  if (process.client) {
    // Set axios base URL
    localStorage.setItem('axiosBase', 'http://localhost:3333');

    // Create axios instance
    const axiosInstance = createAxiosInstance();

    if(route.path.startsWith('/forgotPassword') || route.path.startsWith('/reset-password'))
    {
      return
    }

    try {
      // Check for authenticated user
      const response = await axiosInstance.get('/api/authUser');
      const authUser = response.data;

      // If user exists, store in localStorage
      
      if (authUser) {
        console.log('inside authUser')
        localStorage.setItem('authUser', JSON.stringify(authUser));
        if (route.path.startsWith('/admin') && authUser.user.roleId !== 1) {
          console.log("authUser.roleId", authUser)
          throw new Error('Admin access required');
        }
      }
       else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      console.error('Authentication check failed:', error.message);

      // Redirect to login page if authentication fails
      router.push('/login');
    }
  }
});
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
