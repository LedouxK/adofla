<template>
    <div :class="[
      tier.featured ? 'relative bg-violet-900 shadow-2xl' : 'bg-white/60 sm:mx-8 lg:mx-0', 
      positionClass,
      'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10'
    ]">
      <h3 :id="tier.id" :class="[tier.featured ? 'text-violet-200' : 'text-violet-600', 'text-base/7 font-semibold']">
        {{ tier.name }}
      </h3>
      
      <p class="mt-4 flex items-baseline gap-x-2">
        <span :class="[tier.featured ? 'text-white' : 'text-gray-900', 'text-5xl font-semibold tracking-tight']">
          {{ currentPrice }} €
        </span>
        <span :class="[tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base']">
          /{{ billingPeriod === 'monthly' ? 'mois' : 'an' }}
        </span>
      </p>
      
      <p :class="[tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base/7']">
        {{ tier.description }}
      </p>
      
      <ul role="list" :class="[tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-8 space-y-3 text-sm/6 sm:mt-10']">
        <li v-for="feature in tier.features" :key="feature" class="flex gap-x-3">
          <CheckIcon :class="[tier.featured ? 'text-violet-200' : 'text-violet-600', 'h-6 w-5 flex-none']" aria-hidden="true" />
          {{ feature }}
        </li>
      </ul>
      
      <a 
        @click="subscribe" 
        :class="[
          tier.featured ? 'bg-violet-500 text-white shadow-sm hover:bg-violet-400 focus-visible:outline-violet-500' : 'text-violet-600 ring-1 ring-inset ring-violet-200 hover:ring-violet-300 focus-visible:outline-violet-600', 
          'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 cursor-pointer'
        ]"
      >
        Commencer maintenant
      </a>
    </div>
  </template>
  
  <script>
  import { CheckIcon } from '@heroicons/vue/20/solid'
  
  export default {
    name: 'SubscriptionCard',
    components: {
      CheckIcon
    },
    props: {
      tier: {
        type: Object,
        required: true
      },
      featured: {
        type: Boolean,
        default: false
      },
      position: {
        type: String,
        default: 'middle', // 'first', 'middle', 'last'
        validator: value => ['first', 'middle', 'last'].includes(value)
      },
      billingPeriod: {
        type: String,
        default: 'monthly',
        validator: value => ['monthly', 'yearly'].includes(value)
      }
    },
    computed: {
      positionClass() {
        if (this.position === 'first') {
          return 'rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none';
        } else if (this.position === 'last') {
          return 'sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl';
        }
        return '';
      },
      currentPrice() {
        return this.billingPeriod === 'monthly' 
          ? this.tier.monthlyPrice 
          : (this.tier.yearlyPrice / 12).toFixed(2);
      }
    },
    methods: {
      subscribe() {
        this.$emit('subscribe', {
          id: this.tier.id,
          type: this.billingPeriod === 'monthly' ? 'month' : 'year'
        });
      }
    }
  }
  </script>