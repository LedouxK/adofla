<template>
  <div class="mx-auto mt-8 mb-16 grid max-w-lg grid-cols-1 items-stretch gap-y-6 sm:mt-12 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3" style="min-height: 620px;">
    <!-- Plans organisés par ordre de priorité souhaité -->
    <!-- Free Plan (toujours en premier) -->
    <SubscriptionPlan 
      v-if="getFreePlan" 
      :plan="getFreePlan" 
      @subscribe="onSubscribe"
    />
    
    <!-- Mid-Tier Plan (en deuxième) -->
    <SubscriptionPlan 
      v-if="getMidTierPlan" 
      :plan="getMidTierPlan" 
      @subscribe="onSubscribe"
    />
    
    <!-- Premium Plan (en troisième) -->
    <SubscriptionPlan 
      v-if="getPremiumPlan" 
      :plan="getPremiumPlan" 
      @subscribe="onSubscribe"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SubscriptionPlan from '@/components/cards/SubscriptionPlan.vue'

const props = defineProps({
  plans: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['subscribe'])

// Plans par type - adaptation pour reconnaître les noms en français et en anglais
const getFreePlan = computed(() => props.plans.find(plan => 
  plan.name.includes('Free') || plan.name.includes('Gratuit')
))

const getMidTierPlan = computed(() => props.plans.find(plan => 
  plan.name.includes('Mid-Teir') || plan.name.includes('Mid-Tier') || 
  plan.name.includes('Intermédiaire')
))

const getPremiumPlan = computed(() => props.plans.find(plan => 
  plan.name.includes('Premium')
))

const onSubscribe = (payload) => {
  emit('subscribe', payload)
}
</script>

<style scoped>
@import '@/assets/subscription/style.css';
</style>
