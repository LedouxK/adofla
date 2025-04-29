<template>
  <Dropdown placement="bottom-end">
    <button class="circle-button ml-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
      <!-- Image standard avec paramètres anti-cache -->
      <img 
        :src="currentAvatarPath"
        @error="handleImageError"
        class="user-avatar"
        alt="Avatar utilisateur"
      />
    </button>

    <template #list>
      <DropdownMenu class="user-dropdown-menu">
        <!-- En-tête du menu avec infos utilisateur -->
        <div class="px-4 py-3 border-b border-gray-100">
          <div class="mb-2">
            <div class="font-medium text-gray-900">{{ userName }}</div>
            <div class="text-sm text-gray-500 truncate max-w-[220px]" :title="userEmail">{{ userEmail }}</div>
          </div>
        </div>
        
        <!-- Options du menu -->
        <DropdownItem @click="$emit('profile')" class="flex items-center py-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profil
        </DropdownItem>
        <DropdownItem @click="$emit('logout')" class="flex items-center py-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Déconnexion
        </DropdownItem>
      </DropdownMenu>
    </template>
  </Dropdown>
</template>

<script>
import ProfileImage from './ProfileImage.vue';

export default {
  name: 'UserAvatar',
  components: {
    ProfileImage
  },
  props: {
    imagePath: {
      type: String,
      required: true
    }
  },
  emits: ['profile', 'logout'],
  data() {
    return {
      imageVersion: Date.now(), // Utilisé pour forcer le rechargement de l'image
      fallbackImage: '/assets/media/avatars/default-avatar.png',
      userData: null
    }
  },
  computed: {
    userName() {
      return this.userData?.name || 'Utilisateur';
    },
    userEmail() {
      return this.userData?.email || '';
    },
    currentAvatarPath() {
      // Vérifie d'abord s'il y a une photo de profil dans le localStorage
      const storedPic = localStorage.getItem('userProfilePic');
      if (storedPic) {
        return `/uploads/profile/${storedPic}`;
      }
      // Sinon utilise la propriété imagePath avec un paramètre de version
      return this.imagePath + '?v=' + this.imageVersion;
    }
  },
  mounted() {
    this.loadUserData();
    // Écouter un événement global pour rafraîchir l'avatar si le profil est mis à jour
    window.addEventListener('profile-updated', this.refreshAvatar);
  },
  beforeUnmount() {
    window.removeEventListener('profile-updated', this.refreshAvatar);
  },
  methods: {
    handleImageError(e) {
      e.target.src = this.fallbackImage;
    },
    refreshAvatar() {
      // Force le rechargement de l'image en modifiant le paramètre de version
      this.imageVersion = Date.now();
      // Recharge aussi les données utilisateur
      this.loadUserData();
    },
    loadUserData() {
      try {
        // Récupère les données utilisateur depuis le localStorage
        const userData = localStorage.getItem('authUser');
        if (userData) {
          this.userData = JSON.parse(userData).user;
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur', error);
      }
    }
  }
}
</script>

<style scoped>
.circle-button {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0;
  background-color: #7B68EE;
  border: 2px solid #7B68EE;
  transition: all 0.2s ease;
}

.circle-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 0 2px rgba(123, 104, 238, 0.2);
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: -webkit-optimize-contrast; /* Amélioration du rendu sur Chrome/Safari */
  image-rendering: crisp-edges; /* Amélioration sur Firefox */
  transform: translateZ(0); /* Forcer l'accélération matérielle */
  backface-visibility: hidden; /* Réduire le flou lors des transitions */
}

:deep(.user-dropdown-menu) {
  min-width: 240px;
  padding-top: 0;
  padding-bottom: 0;
  overflow: hidden;
  border-radius: 8px;
}
</style>