<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Barre de navigation supérieure avec breadcrumb et bouton de retour -->
    <div class="bg-white shadow-sm">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <router-link to="/" class="hover:text-indigo-600 transition-colors">Accueil</router-link>
            <span class="text-gray-400">/</span>
            <span class="text-indigo-600 font-medium">Mon Profil</span>
          </div>
          <router-link to="/" class="flex items-center text-sm text-gray-600 hover:text-indigo-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- Contenu principal -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <!-- Entête avec banner et photo de profil -->
        <div class="relative">
          <!-- Banner avec dégradé -->
          <div class="bg-gradient-to-r from-indigo-500 to-purple-600 h-48"></div>
          
          <!-- Photo de profil et actions principales -->
          <div class="flex flex-col md:flex-row justify-between px-6 md:px-8">
            <!-- Photo de profil avec overlay d'édition -->
            <div class="relative -mt-16 flex justify-center md:justify-start">
              <div class="relative group">
                <div @click="triggerFileInput" class="cursor-pointer relative inline-block">
                  <!-- Utiliser une image standard avec force-refresh par timestamp -->
                  <div class="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden">
                    <img 
                      :src="`/uploads/profile/${profile.pPic}?v=${imageTimestamp}`"
                      @error="handleImageError"
                      class="w-full h-full object-cover"
                      alt="Photo de profil" 
                    />
                  </div>
                  
                  <!-- Composant de recadrage -->
                  <ProfileCropper
                    :visible.sync="showCropper"
                    :image-file="selectedFileForCrop"
                    @crop="handleCroppedImage"
                    @cancel="cancelCrop"
                    @error="handleCropError"
                  />
                  
                  <!-- Toast de notification -->
                  <div v-if="notification.show" 
                       :class="['fixed z-50 bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-md transition-opacity duration-300',
                               notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white']">
                    <div class="flex items-center">
                      <div v-if="notification.type === 'success'" class="mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div v-else class="mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="font-bold">{{ notification.title }}</h3>
                        <p>{{ notification.message }}</p>
                      </div>
                      <button @click="closeNotification" class="ml-auto text-white hover:text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
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
                
                <!-- Info des formats acceptés -->
                <p class="text-xs text-gray-500 mt-1 text-center">
                  JPG/PNG seulement
                </p>
              </div>
            </div>
            
            <!-- Boutons d'action -->
            <div class="flex items-center space-x-3 mt-4 md:mt-2">
              <button 
                @click="saveEdit ? saveProfile() : toggleEditMode()" 
                :class="[
                  'flex items-center px-4 py-2 rounded-lg font-medium transition-colors',
                  saveEdit 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                ]"
                :disabled="loading"
              >
                <span v-if="loading" class="mr-2">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                <span v-else-if="saveEdit" class="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </span>
                <span v-else class="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </span>
                {{ saveEdit ? 'Enregistrer' : 'Modifier' }}
              </button>
              
              <button 
                @click="basicStore.changeModel(true)" 
                class="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-.257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clip-rule="evenodd" />
                </svg>
                Mot de passe
              </button>
              
              <button 
                @click="log_out()" 
                class="flex items-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Déconnexion
              </button>
            </div>
          </div>
          
          <!-- Informations principales de l'utilisateur -->
          <div class="px-6 md:px-8 pt-6 pb-4">
            <div class="flex flex-col md:flex-row md:items-end justify-between">
              <div>
                <div v-if="!saveEdit">
                  <h1 class="text-2xl font-bold text-gray-900">{{ displayFullName }}</h1>
                  <p class="text-gray-600 mt-1">{{ profile.role || 'Votre rôle' }}</p>
                </div>
                <div v-else class="space-y-2 my-1">
                  <div class="flex space-x-2">
                    <Input v-model="profile.first_name" placeholder="Prénom" class="w-full md:w-36" />
                    <Input v-model="profile.last_name" placeholder="Nom" class="w-full md:w-36" />
                  </div>
                  <Input v-model="profile.role" placeholder="Votre rôle ou titre" class="w-full md:w-72" />
                </div>
              </div>
              
              <!-- Onglets de navigation -->
              <div class="mt-4 md:mt-0">
                <nav class="flex space-x-1" aria-label="Tabs">
                  <button 
                    @click="activeTab = 'profile'"
                    :class="[
                      'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
                      activeTab === 'profile'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    ]"
                  >
                    Profil
                  </button>
                  <button 
                    @click="activeTab = 'subscription'"
                    :class="[
                      'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
                      activeTab === 'subscription'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    ]"
                  >
                    Abonnement
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Contenu des onglets -->
        <div class="border-t border-gray-100">
          <!-- Onglet Profil -->
          <div v-if="activeTab === 'profile'" class="p-6 md:p-8">
            <div class="bg-gray-50 rounded-xl p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                À propos de moi
              </h3>
              
              <div v-if="!saveEdit" class="bg-white rounded-lg p-4 shadow-sm">
                <p class="text-gray-700 whitespace-pre-line">{{ profile.about || 'Aucune information fournie.' }}</p>
              </div>
              <textarea 
                v-else 
                v-model="profile.about" 
                class="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-40"
                placeholder="Parlez-nous de vous..."
              ></textarea>
            </div>
          </div>
          
          <!-- Onglet Abonnement -->
          <div v-if="activeTab === 'subscription'" class="p-6 md:p-8">
            <div class="bg-gray-50 rounded-xl p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Gérer mon abonnement
              </h3>
              <subscriptionsAbout></subscriptionsAbout>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal changement de mot de passe -->
    <BaseModal 
      :title="'Changer votre mot de passe'" 
      v-model="basicStore.model"
      :styles="{ top: '20px' }"
      :footer-hide="true"
      :cancel-text="'Annuler'"
    >
      <changePassword></changePassword>
    </BaseModal>
  </div>
</template>
  
  <script>
  import { useBasicStore } from '../stores/basic'
  import axios from "axios";
  import axiosInstance from '@/utils/axios';
  import subscriptionsAbout from '../components/subscriptionsAbout.vue';
  import changePassword from '../components/changePassword.vue';
  import ProfileImage from "~/components/ui/ProfileImage.vue";
  import ProfileCropper from "~/components/ui/ProfileCropper.vue";
  import BaseModal from "~/components/ui/BaseModal.vue";
  
  export default {
    name: "profile",
    components: { subscriptionsAbout, changePassword, ProfileImage, ProfileCropper, BaseModal },
    setup() {
      const basicStore = useBasicStore()
      return { basicStore }
    },
    computed: {
      displayFullName() {
        if (this.profile.first_name || this.profile.last_name) {
          return [this.profile.first_name, this.profile.last_name].filter(Boolean).join(' ');
        }
        return this.profile.name || 'Votre nom';
      }
    },
    data() {
      return {
        selectedFile: null,
        selectedFileForCrop: null,
        showCropper: false,
        activeTab: 'profile',
        saveEdit: false,
        loading: false,
        imageTimestamp: Date.now(), // Timestamp pour forcer le rechargement de l'image
        notification: {
          show: false,
          type: 'success',
          title: '',
          message: '',
          timeout: null
        },
        profile: {
          name: "",
          first_name: "",
          last_name: "",
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
          this.showNotification('error', 'Format non pris en charge', 'Seuls les formats JPEG et PNG sont acceptés. Veuillez sélectionner une image au format valide.');
          // Réinitialiser l'input file pour permettre une nouvelle sélection du même fichier
          this.$refs.fileInput.value = '';
          return;
        }
        
        // Réinitialiser d'abord, puis rouvrir
        this.showCropper = false;
        this.$nextTick(() => {
          // Au lieu d'uploader directement, on passe par l'étape de recadrage
          this.selectedFileForCrop = file;
          this.showCropper = true;
        });
      },
      
      // Appelé quand l'utilisateur valide le recadrage
      handleCroppedImage(croppedFile) {
        this.selectedFile = croppedFile;
        this.uploadFile(croppedFile);
        // Réinitialiser l'état pour permettre une nouvelle sélection
        this.showCropper = false;
        this.selectedFileForCrop = null;
      },
      
      // Appelé quand l'utilisateur annule le recadrage
      cancelCrop() {
        this.selectedFileForCrop = null;
        this.$refs.fileInput.value = '';
        // Assurons-nous que la modale se ferme
        this.showCropper = false;
      },
      
      // Gérer les erreurs du composant de recadrage
      handleCropError(errorMessage) {
        this.showNotification('error', 'Erreur', errorMessage);
      },
      
      // Afficher une notification
      showNotification(type, title, message) {
        // Clear any existing timeout
        if (this.notification.timeout) {
          clearTimeout(this.notification.timeout);
        }
        
        // Show the notification
        this.notification = {
          show: true,
          type,
          title,
          message,
          timeout: setTimeout(() => {
            this.notification.show = false;
          }, 5000) // Auto-hide after 5 seconds
        };
      },
      
      // Fermer la notification manuellement
      closeNotification() {
        if (this.notification.timeout) {
          clearTimeout(this.notification.timeout);
        }
        this.notification.show = false;
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
          this.showNotification('error', 'Fichier trop volumineux', 'L\'image ne doit pas dépasser 5MB. Veuillez choisir une image plus légère.');
          return;
        }
  
        const formData = new FormData();
        formData.append("file", selectedFile);
  
        try {
          this.loading = true; // Ajout d'un indicateur de chargement
          var res = await uploadProfilePicture(formData);
          if (res.status === 200) {
            // Récupérer le nouveau nom de fichier depuis la réponse
            const newFileName = res.data?.pPic || '';
            
            // Mettre à jour directement la propriété profile.pPic avec le nouveau nom de fichier
            if (newFileName) {
              this.profile.pPic = newFileName;
              
              // Forcer l'actualisation de l'image en mettant à jour le timestamp
              this.imageTimestamp = Date.now();
            }
            
            this.showNotification('success', 'Succès', 'Photo de profil mise à jour avec succès!');
            
            // Forcer le rechargement des données du profil (mais garder le nouveau nom de fichier)
            // Sauvegarder le nouveau nom de fichier
            const savedPPic = this.profile.pPic;
            this.loadInitials().then(() => {
              // Restaurer le nouveau nom de fichier si nécessaire
              if (savedPPic && (!this.profile.pPic || this.profile.pPic === 'default.jpg')) {
                this.profile.pPic = savedPPic;
                // Rafraîchir à nouveau le timestamp pour s'assurer que l'image est rechargée
                this.imageTimestamp = Date.now();
              }
            });
            
            // Notifier l'application que la photo de profil a été mise à jour
            window.dispatchEvent(new CustomEvent('profile-updated'));
            
            // Mettre à jour les données d'utilisateur dans le localStorage
            try {
              const authUser = JSON.parse(localStorage.getItem('authUser'));
              if (authUser && authUser.user) {
                // Forcer la mise à jour du timestamp pour éviter la mise en cache du navigateur
                const timestamp = new Date().getTime();
                localStorage.setItem('userProfilePic', newFileName + '?v=' + timestamp);
              }
            } catch (error) {
              // Erreur silencieuse - continuer l'exécution
            }
          } else {
            this.showNotification('error', 'Erreur', 'Impossible de télécharger l\'image. Veuillez réessayer.');
          }
        } catch (error) {
          // Gérer l'erreur avec interface utilisateur
          
          // Message d'erreur personnalisé en fonction de la réponse du serveur
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : 'Une erreur est survenue lors du téléchargement de votre photo de profil.';
          
          this.showNotification('error', 'Erreur', errorMessage);
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
          const axiosInstance = axios.create({
            baseURL: localStorage.getItem('axiosBase'),
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          });
  
          // Générer le nom complet à partir du prénom et du nom si disponibles
          const fullName = [this.profile.first_name, this.profile.last_name].filter(Boolean).join(' ') || this.profile.name;
          
          const response = await axiosInstance.post('/api/profile', {
            name: fullName, // Envoyer le nom complet au champ name existant pour compatibilité
            first_name: this.profile.first_name,
            last_name: this.profile.last_name,
            role: this.profile.role,
            about: this.profile.about,
          });
  
          // Si la requête aboutit (statut 2xx), on considère que c'est un succès
          // Le contrôleur renvoie response.created() avec un statut 201
          this.saveEdit = false; // Désactiver le mode édition
          
          // Afficher une notification de succès avec notre propre système de notification
          this.showNotification('success', 'Modifications enregistrées', 'Votre profil a été mis à jour avec succès.');
          
          // Notifier l'application que le profil a été mis à jour
          window.dispatchEvent(new CustomEvent('profile-updated'));
          
          // Mettre à jour les données utilisateur dans le localStorage
          const authUser = JSON.parse(localStorage.getItem('authUser'));
          if (authUser && authUser.user) {
            authUser.user.name = this.profile.name;
            authUser.user.role = this.profile.role;
            localStorage.setItem('authUser', JSON.stringify(authUser));
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour du profil:', error);
          // Afficher une notification d'erreur
          this.showNotification('error', 'Erreur de sauvegarde', 'Impossible de mettre à jour votre profil. Veuillez réessayer.');
        } finally {
          this.loading = false;
        }
      },
      
      async loadInitials() {
        await this.loadProfileInfo();
        
        // Sauvegarde de la photo de profil dans localStorage pour l'en-tête
        if (this.profile?.pPic) {
          const timestamp = new Date().getTime();
          localStorage.setItem('userProfilePic', this.profile.pPic + '?v=' + timestamp);
          
          // Notification pour mettre à jour l'avatar dans l'en-tête
          window.dispatchEvent(new CustomEvent('profile-updated'));
        }
      },
    },
    mounted() {
      this.loadInitials();
    },
  };
  </script>