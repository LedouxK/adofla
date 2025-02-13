import axios from 'axios';

let axiosInstance;

// Create and export a reusable Axios instance
if (process.client) {
  const axiosBase = localStorage.getItem('axiosBase');
  const authToken = localStorage.getItem('authToken');

  axiosInstance = axios.create({
    baseURL: axiosBase,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

//   // Add interceptors for error handling or token refresh (optional)
//   axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error.response && error.response.status === 401) {
//         // Handle unauthorized responses globally (optional)
//         localStorage.removeItem('authToken');
//         window.location.href = '/login';
//       }
//       return Promise.reject(error);
//     }
//   );
// } else {
//   // SSR fallback for axios instance (baseURL only)
//   axiosInstance = axios.create({
//     baseURL: 'http://localhost:3333',
//   });
}

export default axiosInstance;
