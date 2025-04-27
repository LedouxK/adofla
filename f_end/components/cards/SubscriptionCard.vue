<template>
  <div :class="[
    tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white/60 sm:mx-8 lg:mx-0',
    tier.featured ? '' : tierIdx === 0 ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none' : 'sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl',
    'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10 flex flex-col'
  ]">
    <h3 :id="tier.id" :class="[tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'text-base/7 font-semibold']">
      {{ tier.name }}
    </h3>
    <p class="mt-4 flex items-baseline gap-x-2">
      <span :class="[tier.featured ? 'text-white' : 'text-gray-900', 'text-5xl font-semibold tracking-tight']">
        {{ billingPeriod === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice }} €
      </span>
      <span :class="[tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base']">
        /mois
        <span v-if="billingPeriod === 'yearly'" class="block text-xs">facturé annuellement</span>
      </span>
    </p>
    <p :class="[tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base/7']">
      {{ tier.description }}
    </p>
    <ul role="list" :class="[tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-8 space-y-3 text-sm/6 sm:mt-10']">
      <li v-for="feature in tier.features" :key="feature" class="flex gap-x-3">
        <CheckIcon :class="[tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'h-6 w-5 flex-none']" aria-hidden="true" />
        {{ feature }}
      </li>
    </ul>

    <!-- Options d'abonnement -->
    <div class="subscription-options mt-5">
      <div class="mb-3">
        <h4 :class="[tier.featured ? 'text-gray-200' : 'text-gray-700', 'text-sm font-medium mb-2']">Type d'abonnement</h4>
        <div class="flex rounded-md overflow-hidden border border-gray-300">
          <button
            type="button"
            @click="selectSubType('monthly')"
            :class="[
              currentSubType === 'monthly'
                ? (tier.featured ? 'bg-indigo-500 text-white' : 'bg-violet-500 text-white')
                : (tier.featured ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'),
              'flex-1 py-2 text-sm font-medium transition-colors'
            ]">
            Mensuel
          </button>
          <button
            type="button"
            @click="selectSubType('yearly')"
            :class="[
              currentSubType === 'yearly'
                ? (tier.featured ? 'bg-indigo-500 text-white' : 'bg-violet-500 text-white')
                : (tier.featured ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'),
              'flex-1 py-2 text-sm font-medium transition-colors'
            ]">
            Annuel
          </button>
        </div>
      </div>
    </div>

    <div class="mt-auto pt-8">
      <button
        type="button"
        @click="subscribe"
        :class="[
          tier.featured
            ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
            : 'text-violet-600 ring-1 ring-inset ring-violet-200 hover:ring-violet-300 focus-visible:outline-violet-600',
          'mt-4 block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-6'
        ]">
        S'abonner maintenant
      </button>
    </div>
  </div>
</template>

<script setup>
import { CheckIcon } from '@heroicons/vue/20/solid'
import { ref } from 'vue'

const props = defineProps({
  tier: {
    type: Object,
    required: true
  },
  tierIdx: {
    type: Number,
    required: true
  },
  billingPeriod: {
    type: String,
    default: 'monthly'
  }
})

const emit = defineEmits(['subscribe'])

const currentSubType = ref(props.billingPeriod === 'yearly' ? 'yearly' : 'monthly')

const selectSubType = (type) => {
  currentSubType.value = type
}

const subscribe = () => {
  if (!currentSubType.value) {
    alert('Veuillez sélectionner un type d\'abonnement')
    return
  }
  emit('subscribe', {
    subscription_id: props.tier.id,
    type: currentSubType.value
  })
}
</script>
