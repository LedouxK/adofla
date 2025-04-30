<template>
  <div>
    <!-- En-tête -->
    <header class="fixed top-0 w-full bg-white shadow-sm z-50">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center">
          <img src="@/public/assets/media/logos/Flapi_logo.png" alt="Logo FlapiCMS" class="h-10" />
          <span class="text-black font-extrabold text-xl ml-2">FlapiCMS</span>
        </div>
        <div class="flex items-center space-x-6">
          <NuxtLink to="/" class="text-gray-600 hover:text-violet-600 transition-colors">Accueil</NuxtLink>
          <NuxtLink to="/documentation" class="text-violet-600 font-medium">Documentation</NuxtLink>
          <UserAvatar 
            :imagePath="`/uploads/profile/${profile.pPic}`" 
            @profile="goToProfile" 
            @logout="log_out()" 
          />
        </div>
      </div>
    </header>

    <div class="pt-16 min-h-screen bg-gray-50"> <!-- Padding en haut pour compenser l'en-tête fixe -->
      <!-- Contenu principal de la documentation -->
      <div class="container mx-auto px-4 py-12">
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Barre latérale de navigation avec position sticky-->
          <div class="w-full md:w-1/4">
            <div class="bg-white rounded-lg shadow-sm p-6 sticky top-20">
            <h3 class="font-semibold text-lg text-gray-800 mb-4">Documentation</h3>
            <ul class="space-y-2">
              <li>
                <a @click="scrollToSection('introduction')" class="block px-3 py-2 rounded-md cursor-pointer transition-colors" :class="activeSection === 'introduction' ? 'bg-violet-100 text-violet-700' : 'text-gray-600 hover:bg-gray-100'">
                  Introduction
                </a>
              </li>
              <li>
                <a @click="scrollToSection('getting-started')" class="block px-3 py-2 rounded-md cursor-pointer transition-colors" :class="activeSection === 'getting-started' ? 'bg-violet-100 text-violet-700' : 'text-gray-600 hover:bg-gray-100'">
                  Démarrage
                </a>
              </li>
              <li>
                <a @click="scrollToSection('subscriptions')" class="block px-3 py-2 rounded-md cursor-pointer transition-colors" :class="activeSection === 'subscriptions' ? 'bg-violet-100 text-violet-700' : 'text-gray-600 hover:bg-gray-100'">
                  Gestion des abonnements
                </a>
              </li>
              <li>
                <a @click="scrollToSection('profile')" class="block px-3 py-2 rounded-md cursor-pointer transition-colors" :class="activeSection === 'profile' ? 'bg-violet-100 text-violet-700' : 'text-gray-600 hover:bg-gray-100'">
                  Profil utilisateur
                </a>
              </li>
              <li>
                <a @click="scrollToSection('faq')" class="block px-3 py-2 rounded-md cursor-pointer transition-colors" :class="activeSection === 'faq' ? 'bg-violet-100 text-violet-700' : 'text-gray-600 hover:bg-gray-100'">
                  Questions fréquentes
                </a>
              </li>
            </ul>
            </div>
          </div>
          
          <!-- Contenu de la documentation -->
          <div class="w-full md:w-3/4 bg-white rounded-lg shadow-sm p-8">
            <!-- Introduction -->
            <section id="introduction" ref="introduction" class="mb-12">
              <h1 class="text-3xl font-bold text-gray-900 mb-6">Documentation FlapiCMS</h1>
              <p class="text-gray-600 mb-4">
                Bienvenue dans la documentation officielle de FlapiCMS, votre plateforme complète de gestion de contenu et d'abonnements.
                Cette documentation vous aidera à tirer le meilleur parti de notre système et à comprendre toutes ses fonctionnalités.
              </p>
              <div class="bg-violet-50 border-l-4 border-violet-500 p-4 rounded-r-md">
                <p class="text-violet-700">
                  FlapiCMS est conçu pour être intuitif et facile à utiliser, même pour les débutants. Si vous avez des questions qui ne sont pas couvertes dans cette documentation, n'hésitez pas à contacter notre équipe de support.
                </p>
              </div>
            </section>
            
            <!-- Démarrage -->
            <section id="getting-started" ref="getting-started" class="mb-12">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Démarrage rapide</h2>
              <p class="text-gray-600 mb-4">
                Pour commencer à utiliser FlapiCMS, suivez ces étapes simples :
              </p>
              
              <div class="space-y-4 mt-6">
                <div class="flex">
                  <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600 font-semibold mr-4">
                    1
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900">Créez un compte</h3>
                    <p class="text-gray-600">Inscrivez-vous en fournissant votre adresse e-mail et en créant un mot de passe sécurisé.</p>
                  </div>
                </div>
                
                <div class="flex">
                  <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600 font-semibold mr-4">
                    2
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900">Choisissez un forfait</h3>
                    <p class="text-gray-600">Sélectionnez le forfait qui correspond le mieux à vos besoins parmi nos différentes options.</p>
                  </div>
                </div>
                
                <div class="flex">
                  <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600 font-semibold mr-4">
                    3
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900">Configurez votre profil</h3>
                    <p class="text-gray-600">Complétez votre profil avec votre photo et vos informations personnelles.</p>
                  </div>
                </div>
                
                <div class="flex">
                  <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600 font-semibold mr-4">
                    4
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900">Commencez à utiliser la plateforme</h3>
                    <p class="text-gray-600">Explorez les fonctionnalités de FlapiCMS et commencez à gérer vos abonnements et votre contenu.</p>
                  </div>
                </div>
              </div>
            </section>
            
            <!-- Gestion des abonnements -->
            <section id="subscriptions" ref="subscriptions" class="mb-12">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Gestion des abonnements</h2>
              <p class="text-gray-600 mb-4">
                FlapiCMS vous permet de gérer facilement vos abonnements et de suivre leur historique.
              </p>
              
              <div class="mt-6 space-y-6">
                <div>
                  <h3 class="font-medium text-lg text-gray-900 mb-2">Types d'abonnements</h3>
                  <p class="text-gray-600 mb-2">Nous proposons plusieurs formules d'abonnement pour répondre à différents besoins :</p>
                  <ul class="list-disc pl-5 text-gray-600 space-y-1">
                    <li><span class="font-medium">Free</span> - Accès limité aux fonctionnalités de base</li>
                    <li><span class="font-medium">Standard</span> - Accès à la plupart des fonctionnalités essentielles</li>
                    <li><span class="font-medium">Premium</span> - Accès complet à toutes les fonctionnalités avancées</li>
                  </ul>
                </div>
                
                <div>
                  <h3 class="font-medium text-lg text-gray-900 mb-2">Changer d'abonnement</h3>
                  <p class="text-gray-600">
                    Vous pouvez facilement passer à un forfait supérieur ou inférieur à tout moment depuis la section "Abonnements" de votre compte. 
                    Les ajustements de facturation seront appliqués automatiquement.
                  </p>
                </div>
                
                <div>
                  <h3 class="font-medium text-lg text-gray-900 mb-2">Historique des abonnements</h3>
                  <p class="text-gray-600">
                    Consultez votre historique complet d'abonnements, y compris les périodes de facturation, 
                    les paiements effectués et les changements de forfait dans la section "Historique des abonnements".
                  </p>
                </div>
              </div>
            </section>
            
            <!-- Profil utilisateur -->
            <section id="profile" ref="profile" class="mb-12">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Profil utilisateur</h2>
              <p class="text-gray-600 mb-4">
                Gérez vos informations personnelles et personnalisez votre profil.
              </p>
              
              <div class="mt-6 space-y-6">
                <div>
                  <h3 class="font-medium text-lg text-gray-900 mb-2">Modifier votre profil</h3>
                  <p class="text-gray-600 mb-3">
                    Vous pouvez modifier vos informations personnelles à tout moment en accédant à la page de profil.
                    Pour ce faire, cliquez sur votre avatar dans le coin supérieur droit et sélectionnez "Profil".
                  </p>
                  <div class="bg-gray-50 p-4 rounded-md">
                    <p class="text-sm text-gray-600">
                      <strong>Note :</strong> Après avoir effectué des modifications, assurez-vous de cliquer sur le bouton "Enregistrer" pour appliquer vos changements.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 class="font-medium text-lg text-gray-900 mb-2">Photo de profil</h3>
                  <p class="text-gray-600">
                    Pour changer votre photo de profil, cliquez sur l'image actuelle sur votre page de profil et sélectionnez une nouvelle photo.
                    Vous pourrez recadrer l'image pour qu'elle s'adapte parfaitement au format circulaire de l'avatar.
                  </p>
                </div>
                
                <div>
                  <h3 class="font-medium text-lg text-gray-900 mb-2">Changer votre mot de passe</h3>
                  <p class="text-gray-600">
                    Pour des raisons de sécurité, nous vous recommandons de changer régulièrement votre mot de passe.
                    Vous pouvez le faire depuis la page de profil en cliquant sur "Changer le mot de passe".
                  </p>
                </div>
              </div>
            </section>
            
            <!-- Questions fréquentes -->
            <section id="faq" ref="faq">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Questions fréquentes</h2>
              
              <div class="mt-6 space-y-5">
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                  <button class="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors" @click="toggleFaq(1)">
                    <span class="font-medium">Comment puis-je annuler mon abonnement ?</span>
                    <svg :class="{'rotate-180': openFaq === 1}" class="w-5 h-5 text-gray-500 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div v-if="openFaq === 1" class="p-4 bg-white">
                    <p class="text-gray-600">
                      Vous pouvez annuler votre abonnement à tout moment en accédant à la section "Abonnements" de votre compte.
                      Cliquez sur "Gérer l'abonnement" puis sur "Annuler l'abonnement". Votre accès restera actif jusqu'à la fin de la période de facturation en cours.
                    </p>
                  </div>
                </div>
                
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                  <button class="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors" @click="toggleFaq(2)">
                    <span class="font-medium">Comment contacter le support technique ?</span>
                    <svg :class="{'rotate-180': openFaq === 2}" class="w-5 h-5 text-gray-500 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div v-if="openFaq === 2" class="p-4 bg-white">
                    <p class="text-gray-600">
                      Vous pouvez contacter notre équipe de support technique par e-mail à support@flapicms.com ou en utilisant le formulaire de contact accessible depuis le pied de page de notre site.
                      Notre équipe est disponible du lundi au vendredi, de 9h à 18h (UTC+1).
                    </p>
                  </div>
                </div>
                
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                  <button class="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors" @click="toggleFaq(3)">
                    <span class="font-medium">Puis-je changer de forfait à tout moment ?</span>
                    <svg :class="{'rotate-180': openFaq === 3}" class="w-5 h-5 text-gray-500 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div v-if="openFaq === 3" class="p-4 bg-white">
                    <p class="text-gray-600">
                      Oui, vous pouvez changer de forfait à tout moment. Si vous passez à un forfait supérieur, la différence sera facturée au prorata pour le reste de la période en cours.
                      Si vous passez à un forfait inférieur, le changement prendra effet à la fin de votre période de facturation actuelle.
                    </p>
                  </div>
                </div>
                
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                  <button class="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors" @click="toggleFaq(4)">
                    <span class="font-medium">Comment réinitialiser mon mot de passe ?</span>
                    <svg :class="{'rotate-180': openFaq === 4}" class="w-5 h-5 text-gray-500 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div v-if="openFaq === 4" class="p-4 bg-white">
                    <p class="text-gray-600">
                      Si vous avez oublié votre mot de passe, cliquez sur "Mot de passe oublié ?" sur la page de connexion.
                      Vous recevrez un e-mail avec un lien pour réinitialiser votre mot de passe.
                      Ce lien est valable pendant 24 heures.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { log_out } from '@/utils/auth'

export default {
  name: 'Documentation',
  data() {
    return {
      profile: {
        pPic: 'default.jpg'
      },
      activeSection: 'introduction',
      openFaq: null,
      observer: null
    };
  },
  mounted() {
    this.loadProfile();
    
    // Configuration de l'Intersection Observer pour suivre les sections visibles
    this.setupSectionObserver();
  },
  
  beforeUnmount() {
    // Nettoyer l'observer quand le composant est détruit
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    log_out,
    loadProfile() {
      // Charger les informations de profil depuis le localStorage ou l'API
      const authUser = JSON.parse(localStorage.getItem('authUser'));
      if (authUser && authUser.profile && authUser.profile.p_pic) {
        this.profile.pPic = authUser.profile.p_pic;
      }
    },
    goToProfile() {
      this.$router.push('/profile');
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        // Calculer la position de l'élément et soustraire la hauteur de l'en-tête (environ 64px)
        const headerHeight = 80; // Hauteur approximative de l'en-tête en pixels
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        
        // Faire défiler jusqu'à la position calculée
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        this.activeSection = sectionId;
      }
    },
    toggleFaq(id) {
      this.openFaq = this.openFaq === id ? null : id;
    },
    
    setupSectionObserver() {
      // Créer un Intersection Observer pour détecter la section visible
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            // Mettre à jour la section active quand une section devient visible
            this.activeSection = entry.target.id;
          }
        });
      }, {
        // Ces paramètres déterminent quand une section est considérée comme visible
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0.3
      });
      
      // Observer toutes les sections - introduction, getting-started, etc.
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        this.observer.observe(section);
      });
    }
  }
};
</script>

<style scoped>
/* Styles pour la documentation */
.faq-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.faq-open {
  max-height: 1000px; /* Hauteur maximale pour permettre l'animation */
  transition: max-height 0.6s ease-in;
}

/* Ajouter un peu d'espace au-dessus des sections pour éviter que les titres soient cachés */
section {
  scroll-margin-top: 80px; /* Correspond à la hauteur de l'en-tête */
  padding-top: 1rem;
}

/* Styles pour la navigation active */
.router-link-active {
  color: rgb(124, 58, 237); /* text-violet-600 */
  font-weight: 500; /* font-medium */
}

/* Animation de rotation pour les accordéons */
.rotate-180 {
  transform: rotate(180deg);
}

/* Transition douce pour tous les éléments interactifs */
a, button {
  transition: all 0.2s ease;
}
</style>
