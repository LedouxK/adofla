<template>
    <div class="bg-gray-50 min-h-screen py-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <!-- Profile Header - Changement pour utiliser le même dégradé que la page d'accueil -->
          <div class="bg-gradient-to-r from-purple-400 to-indigo-500 h-32 md:h-48"></div>
          
          <div class="flex flex-col md:flex-row">
            <!-- Left Column - Profile Picture and Basic Info -->
            <div class="md:w-1/3 p-6 border-r border-gray-200">
              <div class="flex flex-col items-center">
                <!-- Profile Picture Section -->
                <div class="relative -mt-20 mb-10">
                  <!-- Image clickable pour upload -->
                  <div class="cursor-pointer group" @click="triggerFileInput">
                    <img 
                      :src="`/uploads/profile/${profile.pPic}`"
                      @error="handleImageError"
                      class="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg transition-opacity group-hover:opacity-80"
                      alt="Profile Picture" 
                    />
                    <!-- Overlay d'édition sur hover -->
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div class="bg-black bg-opacity-50 rounded-full w-full h-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Input file caché -->
                  <input 
                    type="file" 
                    ref="fileInput" 
                    class="hidden" 
                    @change="handleFileChange" 
                    accept="image/jpeg,image/png,image/jpg" 
                  />
                  
                  <!-- Info des formats acceptés SOUS l'image -->
                  <p class="text-xs text-gray-500 mt-2 text-center">
                    Formats acceptés: JPG, PNG
                  </p>
                </div>
  
                <!-- Basic Profile Info -->
                <div class="w-full text-center mb-6">
                  <h2 v-if="!saveEdit" class="text-2xl font-bold text-gray-800">{{ profile.name }}</h2>
                  <Input v-else v-model="profile.name" placeholder="Your Name" class="mb-2 w-full" />
                  
                  <p v-if="!saveEdit" class="text-gray-600 mt-1">{{ profile.role }}</p>
                  <Input v-else v-model="profile.role" placeholder="Your Role" class="w-full" />
                </div>
  
                <!-- Quick Actions - Adaptation des couleurs des boutons -->
                <div class="w-full space-y-2">
                  <button 
                    @click="saveEdit ? saveProfile() : toggleEditMode()" 
                    :class="[
                      'w-full py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center',
                      saveEdit 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                    ]"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="mr-2">
                      <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    <span v-else-if="saveEdit" class="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    <span v-else class="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </span>
                    {{ saveEdit ? 'Save Profile' : 'Edit Profile' }}
                  </button>
  
                  <button 
                    @click="basicStore.changeModel(true)" 
                    class="w-full py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md font-medium transition-colors flex items-center justify-center"
                  >
                    <span class="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-.257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    Change Password
                  </button>
  
                  <button 
                    @click="log_out()" 
                    class="w-full py-2 px-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-md font-medium transition-colors flex items-center justify-center"
                  >
                    <span class="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 5a1 1 0 10-2 0v4.3a1 1 0 102 0V8zm-1 7a1 1 0 100 2h.01a1 1 0 100-2H9z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    Logout
                  </button>
  
                  <router-link 
                    to="/" 
                    class="w-full py-2 px-4 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-md font-medium transition-colors flex items-center justify-center"
                  >
                    <span class="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                    </span>
                    Home
                  </router-link>
                </div>
              </div>
            </div>
  
            <!-- Right Column - Tabs with Profile and Subscription -->
            <div class="md:w-2/3 p-6">
              <div class="border-b border-gray-200 mb-6">
                <nav class="flex space-x-8" aria-label="Tabs">
                  <button 
                    @click="activeTab = 'profile'"
                    :class="[
                      'py-4 px-1 border-b-2 font-medium text-sm',
                      activeTab === 'profile'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    ]"
                  >
                    Profile
                  </button>
                  <button 
                    @click="activeTab = 'subscription'"
                    :class="[
                      'py-4 px-1 border-b-2 font-medium text-sm',
                      activeTab === 'subscription'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    ]"
                  >
                    Subscription
                  </button>
                </nav>
              </div>
  
              <!-- Tab Content -->
              <div v-if="activeTab === 'profile'" class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">About Me</h3>
                  <p v-if="!saveEdit" class="text-gray-700 whitespace-pre-line">{{ profile.about || 'No information provided yet.' }}</p>
                  <textarea 
                    v-else 
                    v-model="profile.about" 
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-40"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>
              </div>
  
              <div v-if="activeTab === 'subscription'">
                <subscriptionsAbout></subscriptionsAbout>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Change Password Modal -->
      <Modal 
        title="Changer votre mot de passe" 
        v-model="basicStore.model"
        :styles="{ top: '20px' }"
        footer-hide
        cancelText="Annuler"
        backText="Retour"
      >
        <changePassword></changePassword>
      </Modal>
    </div>
  </template>
  
  <script>
  import { useBasicStore } from '../stores/basic'
  import axios from "axios";
  import axiosInstance from '@/utils/axios';
  import subscriptionsAbout from '../components/subscriptionsAbout.vue';
  import changePassword from '../components/changePassword.vue';
  
  export default {
    name: "profile",
    components: { subscriptionsAbout, changePassword },
    setup() {
      const basicStore = useBasicStore()
      return { basicStore }
    },
    data() {
      return {
        selectedFile: null,
        activeTab: 'profile',
        saveEdit: false,
        loading: false,
        profile: {
          name: "",
          pPic: "default.jpg",
          role: "",
          about: ""
        },
        allowedImageTypes: ['image/jpeg', 'image/png', 'image/jpg'] // Types MIME autorisés
      };
    },
    methods: {
      handleImageError(e) {
        e.target.src = '/uploads/profile/default.jpg';
        console.log("Image de profil non trouvée, utilisation de l'image par défaut");
      },
      
      triggerFileInput() {
        this.$refs.fileInput.click();
      },
      
      handleFileChange(event) {
        const file = event.target.files[0];
        
        if (!file) return;
        
        // Vérification du type MIME du fichier
        if (!this.allowedImageTypes.includes(file.type)) {
          this.$Notice.error({
            title: 'Format non pris en charge',
            desc: 'Seuls les formats JPEG et PNG sont acceptés. Veuillez sélectionner une image au format valide.'
          });
          // Réinitialiser l'input file pour permettre une nouvelle sélection du même fichier
          this.$refs.fileInput.value = '';
          return;
        }
        
        this.uploadFile(file);
      },
      
      async uploadFile(selectedFile) {
        if (!selectedFile) {
          return;
        }
        
        // Double vérification du type de fichier
        if (!this.allowedImageTypes.includes(selectedFile.type)) {
          this.$Notice.error({
            title: 'Format non pris en charge',
            desc: 'Seuls les formats JPEG et PNG sont acceptés. Veuillez sélectionner une image au format valide.'
          });
          return;
        }
        
        // Vérification de la taille du fichier (optionnel, limite à 5MB par exemple)
        const maxSize = 5 * 1024 * 1024; // 5MB en octets
        if (selectedFile.size > maxSize) {
          this.$Notice.error({
            title: 'Fichier trop volumineux',
            desc: 'L\'image ne doit pas dépasser 5MB. Veuillez choisir une image plus légère.'
          });
          return;
        }
  
        const formData = new FormData();
        formData.append("file", selectedFile);
  
        try {
          this.loading = true; // Ajout d'un indicateur de chargement
          var res = await uploadProfilePicture(formData);
          
          if (res.status === 200) {
            this.$Notice.success({
              title: 'Succès',
              desc: 'Photo de profil mise à jour avec succès!'
            });
            this.loadInitials();
          } else {
            this.$Notice.error({
              title: 'Erreur',
              desc: 'Impossible de télécharger l\'image. Veuillez réessayer.'
            });
          }
        } catch (error) {
          console.error("Upload error:", error);
          
          // Message d'erreur personnalisé en fonction de la réponse du serveur
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : 'Une erreur est survenue lors du téléchargement de votre photo de profil.';
          
          this.$Notice.error({
            title: 'Erreur',
            desc: errorMessage
          });
        } finally {
          this.loading = false; // Désactiver l'indicateur de chargement
          // Réinitialiser l'input file
          if (this.$refs.fileInput) {
            this.$refs.fileInput.value = '';
          }
        }
      },
      
      toggleEditMode() {
        this.saveEdit = !this.saveEdit;
      },
      
      async loadProfileInfo() {
        try {
          const res = await uploadProfileInformation();
          if (res.status === 200) {
            this.profile = res.data;
          }
        } catch (error) {
          console.error("Error loading profile information:", error);
          this.$Notice.error({
            title: 'Erreur',
            desc: 'Impossible de charger les informations du profil'
          });
        }
      },
      
      async saveProfile() {
        this.loading = true;
        
        try {
          await axiosInstance.post("/api/profile", this.profile);
          this.loadProfileInfo();
          this.saveEdit = false;
          this.$Notice.success({
            title: 'Succès',
            desc: 'Profil mis à jour avec succès!'
          });
        } catch (error) {
          console.error("Error updating profile:", error);
          this.$Notice.error({
            title: 'Erreur',
            desc: 'Impossible de mettre à jour le profil'
          });
        } finally {
          this.loading = false;
        }
      },
      
      loadInitials() {
        this.loadProfileInfo();
      },
    },
    mounted() {
      this.loadInitials();
    },
  };
  </script>