<template>
    <div class="w-full md:w-1/3 px-4 mb-8">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500 text-white mb-6">
          <span class="text-xl font-bold">{{ number }}</span>
        </div>
        <h3 class="text-xl font-semibold mb-4">{{ title }}</h3>
        <p class="text-gray-600">{{ description }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StepCard',
    props: {
      number: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }
  }
  </script>