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
}

export const log_out = async ()=>
{
  await axiosInstance.get("/api/logout");
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
  window.location.reload(true);
}