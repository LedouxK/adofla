<template>
  <section class="py-8 bg-white relative">
    <!-- En-tête de la section tarifaire -->
    <PricingHeader 
      :title="title"
      :subtitle="subtitle"
      :description="description"
    />
    
    <!-- Grille des plans d'abonnement -->
    <PricingPlans 
      :plans="subscriptions" 
      @subscribe="onSubscribe"
    />
  </section>
</template>

<script setup>
import PricingHeader from './PricingHeader.vue'
import PricingPlans from './PricingPlans.vue'

const props = defineProps({
  subscriptions: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: "Choisissez le forfait adapté à vos besoins"
  },
  subtitle: {
    type: String,
    default: "Tarifs"
  },
  description: {
    type: String,
    default: "Optez pour un forfait abordable qui regroupe les meilleures fonctionnalités pour engager votre audience, fidéliser vos clients et stimuler vos ventes."
  }
})

const emit = defineEmits(['subscribe'])

const onSubscribe = (payload) => {
  emit('subscribe', payload)
}
</script>
