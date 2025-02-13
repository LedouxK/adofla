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

export const uploadProfilePicture = async (data)=>
{
   const res = await axiosInstance.post("/api/profilePicture", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res
}

export const uploadProfileInformation = async ()=>
  {
    const res = await axiosInstance.get("/api/profile");
    
    return res
  }