<template>
    <div class="p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-violet-100 text-violet-500">
        <Icon :type="icon" size="24" />
      </div>
      <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
      <p class="text-gray-600">{{ description }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FeatureCard',
    props: {
      icon: {
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