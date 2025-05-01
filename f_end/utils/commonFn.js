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

export const uploadProfileInformation = async () => {
  // Créer une instance Axios spécifique avec la bonne configuration
  const axiosBase = localStorage.getItem('axiosBase') || 'http://localhost:3333';
  const authToken = localStorage.getItem('authToken');
  
  // Créer une nouvelle instance avec les bons paramètres
  const instance = axios.create({
    baseURL: axiosBase,
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    timeout: 10000 // 10 secondes de timeout
  });
  
  console.log('Appel API profil vers:', `${axiosBase}/api/profile`);
  
  try {
    const res = await instance.get("/api/profile");
    return res;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    // Ajouter plus de détails sur l'erreur
    if (error.response) {
      // Le serveur a répondu avec un statut d'erreur
      console.error('Statut:', error.response.status);
      console.error('Données:', error.response.data);
    } else if (error.request) {
      // La requête a été envoyée mais pas de réponse
      console.error('Pas de réponse du serveur');
    }
    throw error;
  }
}