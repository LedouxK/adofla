<template>
  <div>
    <!-- En-tête -->
    <header class="fixed top-0 w-full bg-white shadow-sm z-50">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center">
          <img src="@/public/assets/media/logos/Flapi_logo.png" alt="Logo FlapiCMS" class="h-10" />
          <span class="text-black font-extrabold text-xl ml-2">FlapiCMS</span>
        </div>
        <div class="flex items-center">
          <UserAvatar 
            :imagePath="`/uploads/profile/${profile.pPic}`" 
            @profile="goToProfile" 
            @logout="log_out()" 
          />
        </div>
      </div>
    </header>

    <div class="pt-16"> <!-- Padding en haut pour compenser l'en-tête fixe -->
      <!-- Section Héro -->
      <section class="bg-gradient-to-r from-purple-50 to-violet-100 py-20">
        <div class="container mx-auto px-4">
          <div class="flex flex-wrap items-center">
            <div class="w-full lg:w-1/2 mb-10 lg:mb-0">
              <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Créez des Sites Web Sans Code
              </h1>
              <p class="text-xl text-gray-600 mb-8">
                Développez des applications web exceptionnelles avec notre CMS glisser-déposer. Déploiement en quelques secondes, domaine dédié et sécurisation optimale de vos données.
              </p>
              <div class="flex flex-wrap">
                <AppButton variant="primary" className="mr-4 mb-4 bg-violet-600 hover:bg-violet-700 border-0" @click="startNow">
                  Commencer
                </AppButton>
                <AppButton variant="secondary" className="mb-4 border-violet-400 text-violet-600" @click="showDemo">
                  Voir la démo
                </AppButton>
              </div>
            </div>
            <div class="w-full lg:w-1/2">
              <div class="bg-violet-100 p-8 rounded-lg shadow-lg flex items-center justify-center">
                <div class="text-center">
                  <div class="mx-auto w-32 h-32 bg-violet-500 rounded-full flex items-center justify-center mb-4">
                    <Icon type="ios-move" size="64" color="#ffffff" />
                  </div>
                  <p class="text-violet-800 font-bold">Interface Glisser-Déposer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Fonctionnalités -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-16">Pourquoi Choisir FlapiCMS ?</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon="ios-move" 
              title="Glisser-Déposer" 
              description="Interface intuitive pour créer votre site web sans écrire une seule ligne de code."
            />
            
            <FeatureCard 
              icon="md-flash" 
              title="Déploiement Instantané" 
              description="Publiez votre site en quelques secondes grâce à notre système de déploiement en un clic."
            />
            
            <FeatureCard 
              icon="ios-globe" 
              title="Domaine Personnalisé" 
              description="Obtenez un domaine dédié gratuit ou connectez facilement votre domaine existant."
            />
            
            <FeatureCard 
              icon="md-lock" 
              title="Sécurité des Données" 
              description="Protection de niveau entreprise pour garder vos données importantes en sécurité."
            />
          </div>
        </div>
      </section>

      <!-- Section Comment ça Marche -->
      <section class="py-16 bg-purple-50">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-16">Comment Ça Marche</h2>
          
          <div class="flex flex-wrap -mx-4">
            <StepCard 
              number="1" 
              title="Choisissez les Composants" 
              description="Sélectionnez parmi notre bibliothèque de composants préconçus et glissez-les sur votre page."
            />
            
            <StepCard 
              number="2" 
              title="Personnalisez le Design" 
              description="Adaptez votre site avec les couleurs, polices et contenus de votre marque."
            />
            
            <StepCard 
              number="3" 
              title="Publiez Instantanément" 
              description="Cliquez sur publier et votre site est en ligne en quelques secondes avec son propre domaine dédié."
            />
          </div>
        </div>
      </section>

      <!-- Section Tarifs (Votre Section Originale) -->
      <section class="py-16 bg-white">
        <div class="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl mb-10" aria-hidden="true">
          <div class="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-violet-300 to-violet-500 opacity-30" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
        </div>

        <div class="mx-auto max-w-4xl text-center">
          <h2 class="text-lg font-semibold text-violet-600">Tarifs</h2>
          <p class="mt-4 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Choisissez le forfait adapté à vos besoins</p>
        </div>

        <p class="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg font-medium text-gray-600 sm:text-xl/8">Optez pour un forfait abordable qui regroupe les meilleures fonctionnalités pour engager votre audience, fidéliser vos clients et stimuler vos ventes.</p>
        
        <!-- Billing Switch - Seulement pour les plans payants -->
        <div class="flex justify-center items-center my-12">
          <span class="mr-3 text-base font-medium" :class="billingPeriod === 'monthly' ? 'text-violet-700' : 'text-gray-500'">Mensuel</span>
          <div class="relative inline-flex h-8 w-16 items-center rounded-full cursor-pointer" @click="toggleBillingPeriod">
            <span class="sr-only">Basculer la période de facturation</span>
            <span :class="[
              'absolute inset-0 rounded-full transition-colors duration-300 ease-in-out',
              billingPeriod === 'yearly' ? 'bg-violet-600' : 'bg-gray-200'
            ]"></span>
            <span :class="[
              'inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out',
              billingPeriod === 'yearly' ? 'translate-x-9' : 'translate-x-1'
            ]"></span>
          </div>
          <span class="ml-3 text-base font-medium" :class="billingPeriod === 'yearly' ? 'text-violet-700' : 'text-gray-500'">Annuel</span>
          <span v-if="billingPeriod === 'yearly'" class="ml-2 -translate-y-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">Économisez 20%</span>
        </div>
        
        <!-- Plans Container - Hauteur fixe pour éviter le décalage -->
        <div class="mx-auto mt-8 mb-16 grid max-w-lg grid-cols-1 items-stretch gap-y-6 sm:mt-12 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3" style="min-height: 620px;">
          <SubscriptionCard
            v-for="(sub, idx) in subscriptions"
            :key="sub.id"
            :tier="sub"
            :tierIdx="idx"
            :billingPeriod="billingPeriod"
            @subscribe="subscribeToPlan"
          />
        </div>
      </section>

      <!-- Section Témoignages -->
      <section class="py-16 bg-purple-50">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-16">Ce que disent nos clients</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="FlapiCMS a complètement transformé notre façon de créer des sites web. Ce qui prenait des semaines ne prend plus que quelques heures. L'interface glisser-déposer est incroyablement intuitive."
              author="Sophie Dupont"
              role="Directrice Marketing, TechCorp"
            />
            
            <TestimonialCard 
              quote="La vitesse à laquelle nous pouvons déployer des sites web maintenant est incroyable. Nos clients sont stupéfaits de voir à quelle rapidité nous transformons leurs idées en réalité avec FlapiCMS."
              author="Thomas Bernard"
              role="PDG, DesignWave"
            />
            
            <TestimonialCard 
              quote="N'ayant aucune expérience en programmation, FlapiCMS m'a permis de créer un site web professionnel pour mon entreprise sans avoir à engager un développeur. Ça a tout changé pour moi."
              author="Marie Lefevre"
              role="Propriétaire, Boutique Bloom"
            />
          </div>
        </div>
      </section>

      <!-- Section CTA -->
      <section class="py-20 bg-violet-600 text-white">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold mb-6">Prêt à créer votre site web ?</h2>
          <p class="text-xl mb-10 max-w-2xl mx-auto">Rejoignez des milliers d'entreprises qui créent des sites web exceptionnels avec FlapiCMS.</p>
          <AppButton variant="secondary" className="bg-white text-violet-600 hover:bg-gray-100" @click="startFreeTrial">
            Commencer votre essai gratuit
          </AppButton>
        </div>
      </section>

      <!-- Pied de page -->
      <footer class="bg-gray-900 text-white py-12">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img src="@/public/assets/media/logos/Flapi_logo.png" alt="Logo FlapiCMS" class="h-8 mb-4" />
              <p class="text-gray-400">La façon la plus simple de créer des sites web professionnels sans code.</p>
            </div>
            
            <div>
              <h4 class="text-lg font-semibold mb-4">Produit</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-white">Fonctionnalités</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">Tarifs</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">Tutoriels</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">Marketplace</a></li>
              </ul>
            </div>
            
            <div>
              <h4 class="text-lg font-semibold mb-4">Entreprise</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-white">À propos</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">Carrières</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 class="text-lg font-semibold mb-4">Mentions légales</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-white">Politique de confidentialité</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">Conditions d'utilisation</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">Politique des cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div class="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400 mb-4 md:mb-0">© 2025 FlapiCMS. Tous droits réservés.</p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white"><Icon type="logo-twitter" size="20" /></a>
              <a href="#" class="text-gray-400 hover:text-white"><Icon type="logo-facebook" size="20" /></a>
              <a href="#" class="text-gray-400 hover:text-white"><Icon type="logo-instagram" size="20" /></a>
              <a href="#" class="text-gray-400 hover:text-white"><Icon type="logo-linkedin" size="20" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { CheckIcon } from '@heroicons/vue/20/solid'
</script>

<script>
import axiosInstance from '@/utils/axios';
import { log_out } from '@/utils/auth';
import UserAvatar from '@/components/ui/UserAvatar.vue';
import AppButton from '@/components/ui/AppButton.vue';
import SubscriptionCard from '@/components/cards/SubscriptionCard.vue';
import FeatureCard from '@/components/cards/FeatureCard.vue';
import StepCard from '@/components/cards/StepCard.vue';
import TestimonialCard from '@/components/cards/TestimonialCard.vue';

export default {
  components: {
    UserAvatar,
    AppButton,
    SubscriptionCard,
    FeatureCard,
    StepCard,
    TestimonialCard
  },
  data() {
    return {
      billingPeriod: 'monthly',
      subscriptions: [],
      profile: {
        name: "",
        pPic: "default.jpg",
        role: "",
        about: ""
      }
    };
  },
  methods: {
    toggleBillingPeriod() {
      this.billingPeriod = this.billingPeriod === 'monthly' ? 'yearly' : 'monthly';
      
      // Notification de l'économie réalisée
      if (this.billingPeriod === 'yearly') {
        this.$Notice.success({
          title: 'Économie de 20%',
          desc: 'Profitez de notre tarif préférentiel en choisissant un abonnement annuel.'
        });
      }
    },
    // Optimisé pour meilleures performances
    async fetchSubscriptions() {
      try {
        // Définissons ces fonctionnalités en dehors de la boucle pour éviter de recréer des tableaux
        const regularFeatures = [
          '25 produits', 
          "Jusqu'à 10 000 abonnés", 
          'Analyses avancées', 
          'Support 24h/24 en 24h'
        ];
        
        const featuredFeatures = [
          'Produits illimités',
          'Abonnés illimités',
          'Analyses avancées',
          'Représentant de support dédié',
          'Automatisations marketing',
          'Intégrations personnalisées',
        ];
        
        const response = await axiosInstance.get('/api/subscriptions');
        this.subscriptions = response.data.map((element, index) => {
          const monthlyPrice = element.price;
          const yearlyPrice = (element.price * 0.8 * 12).toFixed(2);
          const featured = index % 2 !== 0;
          
          return {
            ...element,
            featured,
            features: featured ? featuredFeatures : regularFeatures,
            monthlyPrice,
            yearlyPrice
          };
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des abonnements:', error);
        if (error.response && error.response.status === 401) {
          this.$router.push('/login');
        }
      }
    },
    goToProfile() {
      this.$router.push('/profile');
    },
    startNow() {
      // Logique pour démarrer
      this.$Notice.info({
        title: 'Bientôt disponible',
        desc: 'Cette fonctionnalité sera disponible prochainement.'
      });
    },
    showDemo() {
      // Logique pour afficher la démo
      this.$Notice.info({
        title: 'Démo',
        desc: 'La démo sera disponible prochainement.'
      });
    },
    startFreeTrial() {
      // Logique pour démarrer l'essai gratuit
      this.$Notice.info({
        title: 'Essai gratuit',
        desc: 'L\'essai gratuit sera disponible prochainement.'
      });
    },
    log_out,
    async subscribeToPlan(payload) {
      if (!payload.type) {
        this.$Notice.info({
          title: 'Sélectionnez un type!',
        });
        return;
      }
      try {
        const response = await axiosInstance.post('/api/subscribe', {
          subscription_id: payload.subscription_id,
          type: payload.type,
        });

        if (response.data.success) {
          this.$Notice.success({
            title: 'Abonnement réussi!',
          });
        } else {
          this.$Notice.error({
            title: response.data.message ? response.data.message : "L'abonnement a échoué. Veuillez réessayer.",
          });
        }
      } catch (error) {
        console.error("Erreur lors de l'abonnement au forfait:", error);
        this.$Notice.error({
          title: "Une erreur s'est produite lors du traitement de votre abonnement.",
        });
      }
    },
  },
  mounted() {
    this.fetchSubscriptions();
  },
};
</script>

<style scoped>
@import '@/assets/subscription/style.css';

/* Animation du switch */
@keyframes toggleOn {
  0% { transform: translateX(1px); }
  50% { transform: translateX(6px); }
  100% { transform: translateX(9px); }
}

@keyframes toggleOff {
  0% { transform: translateX(9px); }
  50% { transform: translateX(6px); }
  100% { transform: translateX(1px); }
}

.translate-x-9 {
  animation: toggleOn 0.3s ease-in-out;
}

.translate-x-1 {
  animation: toggleOff 0.3s ease-in-out;
}
</style>