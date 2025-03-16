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
          <Dropdown>
            <Button class="circle-button ml-4" type="primary">
              <img src="/uploads/profile/default.jpg" alt="Avatar utilisateur" class="user-avatar" />
            </Button>
            <template #list>
              <DropdownMenu>
                <DropdownItem @click="goToProfile">Profil</DropdownItem>
                <DropdownItem @click="log_out()">Déconnexion</DropdownItem>
              </DropdownMenu>
            </template>
          </Dropdown>
        </div>
      </div>
    </header>

    <div class="pt-16"> <!-- Padding en haut pour compenser l'en-tête fixe -->
      <!-- Section Héro -->
      <section class="bg-gradient-to-r from-indigo-50 to-blue-50 py-20">
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
                <Button type="primary" size="large" class="mr-4 mb-4">Commencer</Button>
                <Button type="default" size="large" class="mb-4">Voir la démo</Button>
              </div>
            </div>
            <div class="w-full lg:w-1/2">
              <div class="bg-indigo-100 p-8 rounded-lg shadow-lg flex items-center justify-center">
                <div class="text-center">
                  <div class="mx-auto w-32 h-32 bg-indigo-500 rounded-full flex items-center justify-center mb-4">
                    <Icon type="ios-move" size="64" color="#ffffff" />
                  </div>
                  <p class="text-indigo-800 font-bold">Interface Glisser-Déposer</p>
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
            <div class="p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-100 text-indigo-500">
                <Icon type="ios-move" size="24" />
              </div>
              <h3 class="text-xl font-semibold mb-2">Glisser-Déposer</h3>
              <p class="text-gray-600">Interface intuitive pour créer votre site web sans écrire une seule ligne de code.</p>
            </div>
            
            <div class="p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100 text-blue-500">
                <Icon type="md-flash" size="24" />
              </div>
              <h3 class="text-xl font-semibold mb-2">Déploiement Instantané</h3>
              <p class="text-gray-600">Publiez votre site en quelques secondes grâce à notre système de déploiement en un clic.</p>
            </div>
            
            <div class="p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100 text-green-500">
                <Icon type="ios-globe" size="24" />
              </div>
              <h3 class="text-xl font-semibold mb-2">Domaine Personnalisé</h3>
              <p class="text-gray-600">Obtenez un domaine dédié gratuit ou connectez facilement votre domaine existant.</p>
            </div>
            
            <div class="p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100 text-red-500">
                <Icon type="md-lock" size="24" />
              </div>
              <h3 class="text-xl font-semibold mb-2">Sécurité des Données</h3>
              <p class="text-gray-600">Protection de niveau entreprise pour garder vos données importantes en sécurité.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Comment ça Marche -->
      <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-16">Comment Ça Marche</h2>
          
          <div class="flex flex-wrap -mx-4">
            <div class="w-full md:w-1/3 px-4 mb-8">
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500 text-white mb-6">
                  <span class="text-xl font-bold">1</span>
                </div>
                <h3 class="text-xl font-semibold mb-4">Choisissez les Composants</h3>
                <p class="text-gray-600">Sélectionnez parmi notre bibliothèque de composants préconçus et glissez-les sur votre page.</p>
              </div>
            </div>
            
            <div class="w-full md:w-1/3 px-4 mb-8">
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500 text-white mb-6">
                  <span class="text-xl font-bold">2</span>
                </div>
                <h3 class="text-xl font-semibold mb-4">Personnalisez le Design</h3>
                <p class="text-gray-600">Adaptez votre site avec les couleurs, polices et contenus de votre marque.</p>
              </div>
            </div>
            
            <div class="w-full md:w-1/3 px-4 mb-8">
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500 text-white mb-6">
                  <span class="text-xl font-bold">3</span>
                </div>
                <h3 class="text-xl font-semibold mb-4">Publiez Instantanément</h3>
                <p class="text-gray-600">Cliquez sur publier et votre site est en ligne en quelques secondes avec son propre domaine dédié.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Tarifs (Votre Section Originale) -->
      <section class="py-16 bg-white">
        <div class="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl mb-10" aria-hidden="true">
          <div class="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
        </div>

        <div class="mx-auto max-w-4xl text-center">
          <h2 class="text-lg font-semibold text-indigo-600">Tarifs</h2>
          <p class="mt-4 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Choisissez le forfait adapté à vos besoins</p>
        </div>

        <p class="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg font-medium text-gray-600 sm:text-xl/8">Optez pour un forfait abordable qui regroupe les meilleures fonctionnalités pour engager votre audience, fidéliser vos clients et stimuler vos ventes.</p>
        
        <div class="mx-auto mt-16 mb-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
          <div v-for="(tier, tierIdx) in subscriptions" :key="tier.id" :class="[tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white/60 sm:mx-8 lg:mx-0', tier.featured ? '' : tierIdx === 0 ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none' : 'sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl', 'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10']">
            <h3 :id="tier.id" :class="[tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'text-base/7 font-semibold']">{{ tier.name }}</h3>
            <p class="mt-4 flex items-baseline gap-x-2">
              <span :class="[tier.featured ? 'text-white' : 'text-gray-900', 'text-5xl font-semibold tracking-tight']">{{ tier.price }} €</span>
            </p>
            <p :class="[tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base/7']">{{ tier.description }}</p>
            <ul role="list" :class="[tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-8 space-y-3 text-sm/6 sm:mt-10']">
              <li v-for="feature in tier.features" :key="feature" class="flex gap-x-3">
                <CheckIcon :class="[tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'h-6 w-5 flex-none']" aria-hidden="true" />
                {{ feature }}
              </li>
            </ul>
            <div class="toggle-button mt-6">
              <button @click="tier.subType = 'month'" :class="tier.subType == 'month' ? 'toggle-option active' : 'toggle-option'">Mensuel</button>
              <button @click="tier.subType = 'year'" :class="tier.subType == 'year' ? 'toggle-option active' : 'toggle-option'">Annuel</button>
            </div>
            <a @click="subscribeToPlan(tier)" :class="[tier.featured ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500' : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600', 'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 cursor-pointer']">Commencer maintenant</a>
          </div>
        </div>
      </section>

      <!-- Section Témoignages -->
      <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-16">Ce que disent nos clients</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <div class="flex items-center mb-4">
                <div class="text-yellow-400 flex">
                  <Icon type="md-star" size="20" v-for="n in 5" :key="n" />
                </div>
              </div>
              <p class="text-gray-600 mb-6">"FlapiCMS a complètement transformé notre façon de créer des sites web. Ce qui prenait des semaines ne prend plus que quelques heures. L'interface glisser-déposer est incroyablement intuitive."</p>
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <p class="font-semibold">Sophie Dupont</p>
                  <p class="text-sm text-gray-500">Directrice Marketing, TechCorp</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <div class="flex items-center mb-4">
                <div class="text-yellow-400 flex">
                  <Icon type="md-star" size="20" v-for="n in 5" :key="n" />
                </div>
              </div>
              <p class="text-gray-600 mb-6">"La vitesse à laquelle nous pouvons déployer des sites web maintenant est incroyable. Nos clients sont stupéfaits de voir à quelle rapidité nous transformons leurs idées en réalité avec FlapiCMS."</p>
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <p class="font-semibold">Thomas Bernard</p>
                  <p class="text-sm text-gray-500">PDG, DesignWave</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <div class="flex items-center mb-4">
                <div class="text-yellow-400 flex">
                  <Icon type="md-star" size="20" v-for="n in 5" :key="n" />
                </div>
              </div>
              <p class="text-gray-600 mb-6">"N'ayant aucune expérience en programmation, FlapiCMS m'a permis de créer un site web professionnel pour mon entreprise sans avoir à engager un développeur. Ça a tout changé pour moi."</p>
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <p class="font-semibold">Marie Lefevre</p>
                  <p class="text-sm text-gray-500">Propriétaire, Boutique Bloom</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section CTA -->
      <section class="py-20 bg-indigo-600 text-white">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold mb-6">Prêt à créer votre site web ?</h2>
          <p class="text-xl mb-10 max-w-2xl mx-auto">Rejoignez des milliers d'entreprises qui créent des sites web exceptionnels avec FlapiCMS.</p>
          <Button type="default" size="large" class="bg-white text-indigo-600 hover:bg-gray-100">Commencer votre essai gratuit</Button>
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

export default {
  data() {
    return {
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
    async fetchSubscriptions() {
      try {
        const response = await axiosInstance.get('/api/subscriptions');
        this.subscriptions = response.data;
        this.subscriptions.forEach((element, index) => {
          if (index % 2 === 0) {
            element.featured = false;
            element.features = [
              '25 produits', 
              "Jusqu'à 10 000 abonnés", 
              'Analyses avancées', 
              'Support 24h/24 en 24h'
            ];
            element.subType = 'month'
          } else {
            element.featured = true;
            element.features = [
              'Produits illimités',
              'Abonnés illimités',
              'Analyses avancées',
              'Représentant de support dédié',
              'Automatisations marketing',
              'Intégrations personnalisées',
            ];
            element.subType = 'month'
          }
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
    log_out,
    async subscribeToPlan(plan) {
      if (!plan.subType) {
        this.$Notice.info({
          title: 'Sélectionnez un type!',
        });
        return;
      }
      try {
        const response = await axiosInstance.post('/api/subscribe', {
          subscription_id: plan.id,
          type: plan.subType,
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

.circle-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0;
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.toggle-button {
  display: flex;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.toggle-option {
  flex: 1;
  padding: 0.5rem;
  text-align: center;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
}

.toggle-option.active {
  background-color: #4f46e5;
  color: white;
}
</style>