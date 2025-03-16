<template>
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <div class="flex items-center mb-4">
        <div class="text-amber-400 flex">
          <Icon type="md-star" size="20" v-for="n in 5" :key="n" />
        </div>
      </div>
      <p class="text-gray-600 mb-6">"{{ quote }}"</p>
      <div class="flex items-center">
        <div class="h-10 w-10 rounded-full bg-violet-100 mr-3"></div>
        <div>
          <p class="font-semibold">{{ author }}</p>
          <p class="text-sm text-gray-500">{{ role }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TestimonialCard',
    props: {
      quote: {
        type: String,
        required: true
      },
      author: {
        type: String,
        required: true
      },
      role: {
        type: String,
        required: true
      }
    }
  }
  </script>