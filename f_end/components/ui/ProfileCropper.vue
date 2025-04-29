<template>
  <Teleport to="body">
    <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <!-- Header -->
        <div class="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 class="text-lg font-medium text-gray-900">Ajuster votre photo</h3>
          <button 
            @click="handleCancel" 
            class="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Content -->
        <div class="p-6">
          <div class="flex flex-col md:flex-row gap-6">
            <div class="w-full md:w-2/3 flex items-center justify-center">
              <Cropper
                ref="cropper"
                :src="imageUrl"
                :stencil-props="{
                  aspectRatio: 1,
                  grid: true,
                  minWidth: 80,
                  minHeight: 80
                }"
                :stencil-component="CircleStencil"
                :canvas="{ width: 500, height: 500 }"
                class="h-[500px] bg-gray-100 rounded-lg shadow-sm overflow-hidden"
                image-restriction="fill-area"
                :resize-image="{ width: 1000, height: 1000 }"
                :transitions="true"
                :default-size="{ width: 400, height: 400 }"
                :default-position="{ left: 0.5, top: 0.5 }"
                @ready="onCropperReady"
                @change="updatePreview"
                @error="handleCropperError"
              />
            </div>
            
            <div class="w-full md:w-1/3">
              <!-- Preview -->
              <div>
                <h4 class="text-md font-medium text-gray-900 mb-3">Aperçu</h4>
                <div class="h-48 w-48 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200 mx-auto">
                  <template v-if="previewUrl">
                    <img :src="previewUrl" alt="Aperçu" class="w-full h-full object-cover" />
                  </template>
                  <div v-else class="h-full w-full flex items-center justify-center text-gray-400 text-sm">
                    Aucun aperçu disponible
                  </div>
                </div>
              </div>
              
              <p class="text-sm text-gray-600 mt-4 text-center">Ajustez votre photo pour qu'elle s'affiche au mieux dans un format circulaire.</p>
            </div>
          </div>
          
          <!-- Instruction à la place du zoom -->
          <div class="mt-6 p-4 bg-gray-50 rounded-lg">
            <p class="text-gray-700 text-sm text-center">
              <span class="flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Astuce
              </span>
              Vous pouvez ajuster le cadre directement sur l'image en le déplaçant ou en redimensionnant les poignées.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button 
            @click="handleCancel" 
            class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Annuler
          </button>
          <button 
            @click="handleConfirm" 
            class="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center"
            :disabled="saving"
          >
            <span v-if="saving" class="mr-2">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

export default {
  name: 'ProfileCropper',
  components: {
    Cropper,
    CircleStencil
  },
  emits: ['update:visible', 'crop', 'cancel', 'error'],
  props: {
    imageFile: {
      type: File,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isVisible: this.visible,
      imageUrl: '',
      previewUrl: '',
      originalFile: null,
      croppedBlob: null,
      coords: null,
      saving: false,
      debugLogs: {
        cropperReady: false,
        previewGenerated: false
      },
      CircleStencil: CircleStencil
    };
  },
  watch: {
    visible(newVal) {
      // Synchroniser l'état interne avec la prop
      this.isVisible = newVal;
      
      // Si la modale s'ouvre et qu'une image est présente
      if (newVal && this.imageFile) {
        // Réinitialiser d'abord l'état du cropper
        this.previewUrl = '';
        this.imageUrl = '';
        
        // Utiliser nextTick pour s'assurer que le DOM est complètement prêt
        this.$nextTick(() => {
          setTimeout(() => {
            this.loadImage(this.imageFile);
          }, 50); // Un petit délai pour s'assurer que le DOM est complètement prêt
        });
      } else if (!newVal) {
        // Si la modale se ferme, nettoyer
        this.imageUrl = '';
        this.previewUrl = '';
      }
    },
    imageFile(newVal) {
      // Si une nouvelle image est fournie et que la modale est visible
      if (newVal && this.visible) {
        this.loadImage(newVal);
      }
    }
  },
  methods: {
    loadImage(file) {
      if (!file) {
        console.error('Aucun fichier à charger');
        return;
      }
      
      this.originalFile = file;
      this.previewUrl = ''; // Réinitialiser l'aperçu
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target.result;
        
        // Précharger l'image pour obtenir ses dimensions
        const img = new Image();
        img.onload = () => {
          // Délai plus long pour s'assurer que le cropper est complètement initialisé
          setTimeout(() => {
            this.$nextTick(() => {
              const cropperElement = this.$refs.cropper;
              if (cropperElement && typeof cropperElement.refresh === 'function') {
                try {
                  // Tenter de rafraîchir le cropper pour qu'il s'adapte mieux à l'image
                  cropperElement.refresh();
                  
                  // Une fois rafraîchit, configurer la taille initiale
                  if (typeof cropperElement.setCoordinates === 'function') {
                    // Force un recadrage initial qui couvre une plus grande partie de l'image
                    cropperElement.setCoordinates({
                      width: 400,
                      height: 400,
                      left: 50,  // % de l'image à partir de la gauche
                      top: 50    // % de l'image à partir du haut
                    });
                  }
                } catch (e) {
                  console.warn('Erreur lors du rafraîchissement du cropper:', e);
                }
              }
              
              // Générer l'aperçu après un délai suffisant
              setTimeout(() => {
                this.updatePreview();
              }, 500);
            });
          }, 300);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    onCropperReady() {
      console.log('Cropper prêt, génération de l\'aperçu...');
      
      // Configurer le cropper pour qu'il utilise l'image de manière optimale
      const cropperElement = this.$refs.cropper;
      if (cropperElement) {
        try {
          // Forcer un recadrage initial qui couvre plus l'image
          if (typeof cropperElement.setCoordinates === 'function') {
            // Essayer de définir des coordonnées qui couvrent une plus grande partie de l'image
            cropperElement.setCoordinates({
              width: 400,
              height: 400,
              left: 50,  // % de l'image à partir de la gauche
              top: 50    // % de l'image à partir du haut
            });
          }
        } catch (e) {
          console.warn('Erreur lors de la configuration initiale du cropper:', e);
        }
      }
      
      // Délai pour s'assurer que le cropper est complètement initialisé
      setTimeout(() => {
        this.updatePreview();
      }, 500);
    },
    
    handleCropperError(error) {
      console.error('Erreur du composant cropper:', error);
    },
    
    updatePreview() {
      try {
        // Si l'image n'est pas encore chargée, ne rien faire
        if (!this.imageUrl) {
          return;
        }
        
        // S'assurer que le DOM est complètement prêt
        this.$nextTick(() => {
          // Récupérer directement l'élément Cropper du DOM via la référence
          const cropperElement = this.$refs.cropper;
          
          if (!cropperElement) {
            console.log('Référence du cropper non disponible pour l\'aperçu');
            this.generateFallbackPreview(); // Générer un aperçu de secours
            return;
          }
          
          // Récupérer l'instance du cropper via la référence
          const cropperInstance = cropperElement.getResult ? cropperElement : null;
          
          if (!cropperInstance) {
            console.log('Instance du cropper non disponible pour l\'aperçu');
            this.generateFallbackPreview(); // Générer un aperçu de secours
            return;
          }
          
          // Continuer avec la génération de l'aperçu
          this.generatePreviewFromCropper(cropperInstance);
        });
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'aperçu:', error);
        this.generateFallbackPreview(); // Générer un aperçu de secours en cas d'erreur
      }
    },
    
    // Générer un aperçu à partir de l'instance du cropper
    generatePreviewFromCropper(cropperInstance) {
      // Essayer d'obtenir le canvas via getResult()
      try {
        const result = cropperInstance.getResult();
        const canvas = result.canvas;
        
        if (!canvas) {
          console.log('Canvas non disponible pour l\'aperçu');
          this.generateFallbackPreview();
          return;
        }
        
        this.generateCircularPreview(canvas);
      } catch (e) {
        console.log('Erreur lors de la génération de l\'aperçu:', e);
        this.generateFallbackPreview();
      }
    },
    
    // Générer un aperçu circulaire à partir de l'image source
    generateFallbackPreview() {
      if (!this.imageUrl) return;
      
      const img = new Image();
      img.src = this.imageUrl;
      
      if (img.complete) {
        this.processImageForFallbackPreview(img);
      } else {
        img.onload = () => this.processImageForFallbackPreview(img);
      }
    },
    
    // Traiter l'image pour générer un aperçu de secours
    processImageForFallbackPreview(img) {
      const canvas = document.createElement('canvas');
      const size = 400;
      canvas.width = size;
      canvas.height = size;
      
      const ctx = canvas.getContext('2d');
      
      // Calculer les dimensions pour un recadrage centré
      const dimension = Math.min(img.width, img.height);
      const offsetX = (img.width - dimension) / 2;
      const offsetY = (img.height - dimension) / 2;
      
      // Dessiner une portion carrée au centre de l'image
      ctx.drawImage(img, offsetX, offsetY, dimension, dimension, 0, 0, size, size);
      
      // Générer l'aperçu circulaire
      this.generateCircularPreview(canvas);
    },
    
    // Générer un aperçu circulaire à partir d'un canvas
    generateCircularPreview(canvas) {
      try {
        // Créer un canvas d'aperçu circulaire
        const size = 200; // Taille de l'aperçu
        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = size;
        previewCanvas.height = size;
        const ctx = previewCanvas.getContext('2d');
        
        // Fond blanc (pour la transparence)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        
        // Dessiner un cercle
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        
        // Dessiner l'image recadrée à l'intérieur du cercle
        ctx.drawImage(canvas, 0, 0, size, size);
        
        // Convertir en data URL pour l'aperçu
        this.previewUrl = previewCanvas.toDataURL(this.originalFile?.type || 'image/jpeg');
        console.log('Aperçu généré avec succès');
        
        // Force le rafraîchissement du DOM
        this.$forceUpdate();
      } catch (error) {
        console.error('Erreur lors de la génération de l\'aperçu circulaire:', error);
      }
    },
    
    handleCancel() {
      // Réinitialiser l'état et fermer la modale
      this.isVisible = false;
      this.imageUrl = ''; // Réinitialiser l'image
      this.previewUrl = ''; // Réinitialiser l'aperçu
      this.$emit('update:visible', false); // Pour .sync
      this.$emit('cancel');
    },
    
    async handleConfirm() {
      this.saving = true;

      try {
        // Approche simplifiée qui garantit le fonctionnement même si l'instance n'est pas correctement initialisée
        let canvas;
        
        // 1. Essayer d'obtenir le canvas via la référence du cropper
        try {
          const cropperElement = this.$refs.cropper;
          if (cropperElement && typeof cropperElement.getResult === 'function') {
            const result = cropperElement.getResult();
            canvas = result.canvas;
          }
        } catch (cropperError) {
          console.log('Méthode principale de recadrage a échoué:', cropperError);
        }

        // 2. Si ça échoue, utiliser l'aperçu généré comme secours
        if (!canvas && this.previewUrl) {
          console.log('Utilisation de l\'aperçu comme image de secours');
          const img = new Image();
          img.src = this.previewUrl;
          
          await new Promise((resolve) => {
            if (img.complete) {
              resolve();
            } else {
              img.onload = () => resolve();
              img.onerror = () => resolve(); // Continuer même en cas d'erreur
            }
          });
          
          canvas = document.createElement('canvas');
          canvas.width = 500;
          canvas.height = 500;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, 500, 500);
        }
        
        // 3. Si tout échoue, utiliser directement l'image originale (sans recadrage)
        if (!canvas && this.imageUrl) {
          console.log('Utilisation de l\'image originale comme dernier recours');
          const img = new Image();
          img.src = this.imageUrl;
          
          await new Promise((resolve) => {
            if (img.complete) {
              resolve();
            } else {
              img.onload = () => resolve();
              img.onerror = () => resolve(); // Continuer même en cas d'erreur
            }
          });
          
          canvas = document.createElement('canvas');
          const size = Math.min(img.width, img.height);
          canvas.width = size;
          canvas.height = size;
          
          const ctx = canvas.getContext('2d');
          // Dessiner l'image centrée pour en prendre une portion carrée
          const offsetX = (img.width - size) / 2;
          const offsetY = (img.height - size) / 2;
          ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);
        }
        
        // Vérifier si nous avons réussi à obtenir un canvas
        if (!canvas) {
          throw new Error('Impossible de générer une image après plusieurs tentatives');
        }

        // Convertir le canvas en Blob avec qualité maximale
        const blob = await new Promise(resolve => {
          canvas.toBlob(blob => {
            resolve(blob);
          }, this.originalFile?.type || 'image/jpeg', 1);
        });
        
        if (!blob) {
          throw new Error('Impossible de générer l\'image recadrée');
        }
        
        // Créer un nouveau fichier à partir du blob
        const croppedFile = new File([blob], this.originalFile?.name || 'photo_profil.jpg', {
          type: this.originalFile?.type || 'image/jpeg',
          lastModified: new Date().getTime()
        });
        
        // Émettre l'événement avec le fichier recadré
        this.$emit('crop', croppedFile);
        
        // Fermer la modale et réinitialiser
        this.isVisible = false;
        this.imageUrl = ''; // Réinitialiser l'image
        this.previewUrl = ''; // Réinitialiser l'aperçu
        this.$emit('update:visible', false);
      } catch (error) {
        console.error('Erreur lors du recadrage:', error);
        // Émettre un événement d'erreur que le composant parent peut intercepter
        this.$emit('error', 'Une erreur est survenue lors du recadrage de l\'image');
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>
