<template>
  <div>
    <!-- Fond décoratif en dégradé -->
    <div class="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl mb-10" aria-hidden="true">
      <div class="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-violet-300 to-violet-500 opacity-30" 
        style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)">
      </div>
    </div>

    <!-- Titres et description -->
    <div class="mx-auto max-w-4xl text-center">
      <h2 class="text-lg font-semibold text-violet-600">{{ subtitle }}</h2>
      <p class="mt-4 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">{{ title }}</p>
    </div>

    <p class="mx-auto mt-3 max-w-2xl text-pretty text-center text-lg font-medium text-gray-600 sm:text-xl/8">
      {{ description }}
    </p>
    
    <!-- Espace réduit après le titre -->
    <div class="h-4"></div>
  </div>
</template>

<script setup>
defineProps({
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
</script>
