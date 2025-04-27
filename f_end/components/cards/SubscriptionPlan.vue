<template>
  <!-- Structure complète avec flexbox pour alignement uniforme -->
  <div :class="[
    plan.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white/60 sm:mx-4 lg:mx-0',
    'rounded-3xl p-8 ring-1 ring-gray-900/10 flex flex-col subscription-card'
  ]">
    <!-- Début du contenu (partie supérieure) -->
    <div class="flex-grow">
      <!-- Titre de l'abonnement -->
      <h3 :id="plan.id" :class="[plan.featured ? 'text-indigo-400' : 'text-indigo-600', 'text-base font-semibold']">
        {{ plan.name }}
      </h3>
      
      <!-- Prix de l'abonnement -->
      <p class="mt-4 flex items-baseline gap-x-2">
        <!-- Affichage du prix avec hauteur fixe pour éviter les décalages -->
        <div class="price-display" :class="{ 'yearly': subscriptionType === 'year' }">
          <span :class="[plan.featured ? 'text-white' : 'text-gray-900', 'text-5xl font-semibold tracking-tight']">
            <span class="price-wrapper">{{ subscriptionType === 'month' ? plan.monthlyPrice : plan.yearlyPrice }} <span class="currency">€</span></span>
          </span>
          <span :class="[plan.featured ? 'text-gray-400' : 'text-gray-500', 'text-base ml-1']">
            /mois
            <span v-if="subscriptionType === 'year'" class="block text-xs text-right">facturé annuellement</span>
          </span>
        </div>
      </p>
      
      <!-- Description de l'abonnement -->
      <p :class="[plan.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base']">
        {{ plan.description }}
      </p>
      
      <!-- Liste des fonctionnalités -->
      <ul role="list" :class="[plan.featured ? 'text-gray-300' : 'text-gray-600', 'mt-8 space-y-3 text-sm']">
        <li v-for="feature in plan.features" :key="feature" class="flex gap-x-3">
          <CheckIcon :class="[plan.featured ? 'text-indigo-400' : 'text-indigo-600', 'h-6 w-5 flex-none']" aria-hidden="true" />
          {{ feature }}
        </li>
      </ul>
    </div>
    
    <!-- Footer - type d'abonnement et bouton (partie inférieure fixée) -->
    <div class="subscription-footer mt-auto pt-6">
      <!-- Type d'abonnement avec ToggleSwitch -->
      <div>
        <p :class="[plan.featured ? 'text-gray-200' : 'text-gray-700', 'text-sm font-medium mb-1']">Type d'abonnement</p>
        
        <!-- Conteneur avec hauteur fixe pour garantir la stabilité du layout -->
        <div class="billing-type-container">
          <!-- Utilisé pour positionner le badge d'économie sans perturber la mise en page -->
          <div class="relative">
            <!-- Composant ToggleSwitch avec v-model -->
            <ToggleSwitch
              v-model="subscriptionType"
              :options="[
                { label: 'Mensuel', value: 'month' },
                { label: subscriptionType === 'year' ? 'Annuel Eco 20%' : 'Annuel', value: 'year' }
              ]"
              :class="{'toggle-custom': true, 'toggle-dark': plan.featured}"
            />
          </div>
        </div>
      </div>
      
      <!-- Bouton d'abonnement -->
      <button 
        @click="subscribe"
        :class="[
          plan.featured 
            ? 'mt-6 block w-full rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500' 
            : 'mt-6 block w-full rounded-md bg-indigo-50 px-3.5 py-2.5 text-center text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        ]"
      >
        S'abonner maintenant
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CheckIcon } from '@heroicons/vue/20/solid'
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue'

const props = defineProps({
  plan: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['subscribe'])

// État local du type d'abonnement (mensuel/annuel)
const subscriptionType = ref('month') // Valeur par défaut

// Fonction pour s'abonner au plan
const subscribe = () => {
  emit('subscribe', {
    subscription_id: props.plan.id,
    type: subscriptionType.value === 'year' ? 'yearly' : 'monthly'
  })
}
</script>

<style scoped>
@import '@/assets/subscription/style.css';

/* Styles pour garantir l'alignement homogène */
.subscription-card {
  min-height: 650px; /* Hauteur minimale fixe pour toutes les cartes */
  display: flex;
  flex-direction: column;
}

.price-display {
  display: flex;
  align-items: baseline;
  height: 60px; /* Hauteur fixe pour l'affichage du prix */
}

.subscription-footer {
  margin-top: auto; /* Pousse le footer vers le bas */
}

.billing-type-container {
  height: 40px; /* Hauteur fixe pour les toggle buttons */
  margin-bottom: 12px;
}
</style>
