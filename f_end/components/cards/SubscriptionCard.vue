<template>
  <div :class="[
    tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white/60 sm:mx-3 lg:mx-0',
    tier.featured ? '' : tierIdx === 0 ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none' : 'sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl',
    'rounded-3xl p-5 ring-1 ring-gray-900/10 sm:p-6 flex flex-col subscription-card'
  ]">
    <h3 :id="tier.id" :class="[tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'text-base/7 font-semibold']">
      {{ tier.name }}
    </h3>
    <div class="mt-4 flex items-baseline gap-x-2">
      <!-- Affichage du prix avec hauteur fixe pour éviter les décalages -->
      <div class="price-display" :class="{ 'yearly': subscriptionType === 'year' }">
        <span :class="[tier.featured ? 'text-white' : 'text-gray-900', 'text-5xl font-semibold tracking-tight']">
          <span class="price-wrapper">{{ subscriptionType === 'month' ? tier.monthlyPrice : tier.yearlyPrice }} <span class="currency">€</span></span>
        </span>
        <span :class="[tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base ml-1']">
          /mois <span v-if="subscriptionType === 'year'" class="text-xs ml-1">(facturé annuellement)</span>
        </span>
      </div>
    </div>
    <p :class="[tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-4 text-base/7']">
      {{ tier.description }}
    </p>
    <ul role="list" :class="[tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-4 space-y-2 text-sm/6 sm:mt-5']">
      <li v-for="feature in tier.features" :key="feature" class="flex gap-x-3">
        <CheckIcon :class="[tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'h-6 w-5 flex-none']" aria-hidden="true" />
        {{ feature }}
      </li>
    </ul>

    <!-- Type d'abonnement avec utilisation du composant ToggleSwitch existant -->
    <div class="mt-3">
      <!-- Label 'Type d'abonnement' supprimé -->
      
      <!-- Conteneur avec hauteur fixe pour garantir la stabilité du layout -->
      <div class="billing-type-container">
        <!-- Utilisé pour positionner le badge d'économie sans perturber la mise en page -->
        <div class="relative">
          <!-- ToggleSwitch avec le badge Eco 20% intégré directement dans le composant -->
        <div class="flex flex-col items-center">
          <div class="relative w-full">
            <ToggleSwitch
              v-model="subscriptionType"
              :options="[
                { label: 'Mensuel', value: 'month' },
                { label: subscriptionType === 'year' ? 'Annuel Eco 20%' : 'Annuel', value: 'year' }
              ]"
              class="toggle-custom"
              :class="{'toggle-dark': tier.featured}"
            />
          </div>
        </div>
        </div>
      </div>
    </div>

    <AppButton
      :variant="tier.featured ? 'primary' : 'outline'"
      class="mt-8 w-full"
      @click="subscribe"
    >
      S'abonner maintenant
    </AppButton>
  </div>
</template>

<script setup>
import { CheckIcon } from '@heroicons/vue/20/solid'
import { ref } from 'vue'
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue'

const props = defineProps({
  tier: {
    type: Object,
    required: true
  },
  tierIdx: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['subscribe'])

// Utilise la valeur par défaut 'month' pour l'état initial
const subscriptionType = ref('month')

// Options pour le ToggleSwitch avec traductions en français
const toggleOptions = [
  { label: 'Mensuel', value: 'month' },
  { label: 'Annuel', value: 'year' }
]

const subscribe = () => {
  emit('subscribe', {
    subscription_id: props.tier.id,
    type: subscriptionType.value === 'year' ? 'yearly' : 'monthly'
  })
}
</script>

<style scoped>
@import '@/assets/subscription/style.css';

/* Styles pour garantir l'alignement homogène */
.subscription-card {
  min-height: 540px; /* Hauteur minimale réduite pour les cartes */
  display: flex;
  flex-direction: column;
  min-width: 250px; /* Élargir les cartes */
}

.price-display {
  display: flex;
  align-items: baseline;
  height: 50px; /* Hauteur fixe réduite pour l'affichage du prix */
}

.billing-type-container {
  height: 36px; /* Hauteur fixe réduite pour les toggle buttons */
  margin-bottom: 10px;
  margin-top: 5px; /* Ajouter un espace en haut après avoir supprimé le titre */
}
</style>
