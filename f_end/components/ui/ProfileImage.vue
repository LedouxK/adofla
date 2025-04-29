<template>
  <div :class="containerClass" :style="containerStyle">
    <img 
      :src="imageSrc" 
      @error="handleImageError" 
      :alt="alt" 
      class="profile-image"
      :class="imageClass"
      :style="imageStyle"
    />
  </div>
</template>

<script>
export default {
  name: 'ProfileImage',
  props: {
    // Chemin de base de l'image (sans extension)
    imagePath: {
      type: String,
      required: true
    },
    // Taille de l'image (sm, md, lg, xl)
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl', 'xxl'].includes(value)
    },
    // Fallback image si l'image principale ne charge pas
    fallbackImage: {
      type: String,
      default: '/uploads/profile/default.jpg'
    },
    // Si true, utilisera la version haute qualité (original)
    highQuality: {
      type: Boolean,
      default: false
    },
    // Classes additionnelles pour le conteneur
    containerClass: {
      type: String,
      default: ''
    },
    // Classes additionnelles pour l'image
    imageClass: {
      type: String,
      default: ''
    },
    // Alt text
    alt: {
      type: String,
      default: 'Photo de profil'
    }
  },
  data() {
    return {
      useOriginal: this.highQuality,
      useFallback: false,
      sizesToPixels: {
        sm: 40,
        md: 64,
        lg: 96,
        xl: 128,
        xxl: 196
      }
    }
  },
  computed: {
    // Chemin de l'image avec paramètre de version pour éviter la mise en cache
    imageSrc() {
      // Si échec de chargement, utiliser fallback
      if (this.useFallback) {
        return this.fallbackImage;
      }
      
      // Déterminer si on utilise l'original ou la version standard
      const basePath = this.useOriginal 
        ? `/uploads/profile/originals${this.imagePath.startsWith('/') ? this.imagePath : '/' + this.imagePath}`
        : this.imagePath;
      
      // Ajouter un timestamp pour éviter la mise en cache
      return `${basePath}?v=${Date.now()}`;
    },
    // Style dynamique pour le conteneur basé sur la taille
    containerStyle() {
      const size = this.sizesToPixels[this.size] || this.sizesToPixels.md;
      return {
        width: `${size}px`,
        height: `${size}px`
      };
    },
    // Style pour l'image
    imageStyle() {
      return {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 'inherit'
      };
    }
  },
  methods: {
    // Gestion d'erreur de chargement d'image
    handleImageError(e) {
      // Si nous utilisions déjà l'original, passer au fallback
      if (this.useOriginal) {
        this.useFallback = true;
        return;
      }
      
      // Sinon, essayer d'abord la version haute qualité
      this.useOriginal = true;
      
      // Réinitialiser la source de l'image
      e.target.src = this.imageSrc;
    }
  }
}
</script>

<style scoped>
.profile-image {
  object-fit: cover;
  image-rendering: -webkit-optimize-contrast; /* Amélioration du rendu sur Chrome/Safari */
  image-rendering: crisp-edges; /* Amélioration sur Firefox */
  transform: translateZ(0); /* Forcer l'accélération matérielle */
  backface-visibility: hidden; /* Réduire le flou lors des transitions */
  transition: all 0.2s ease;
}
</style>
