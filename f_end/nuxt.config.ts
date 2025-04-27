// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@element-plus/nuxt', '@pinia/nuxt'],

  compatibilityDate: '2024-04-03',
  devtools: { enabled: false }, // Désactivé pour améliorer les performances de développement
  
  // Optimisations de performance pour le développement
  vite: {
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'element-plus',
        'view-ui-plus'
      ],
      exclude: []
    },
    build: {
      chunkSizeWarningLimit: 1000, // Augmenter la limite pour éviter les avertissements
      reportCompressedSize: false, // Désactiver les rapports de taille compressée
      cssCodeSplit: false, // Désactiver la division du code CSS en dev
      minify: false, // Pas de minification en dev
    },
    server: {
      hmr: {
        overlay: false // Désactiver l'overlay HMR qui peut causer des problèmes de performance
      }
    }
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  plugins: [
    '~/plugins/view-ui-plus.ts',
  ],

  css: [
    'view-ui-plus/dist/styles/viewuiplus.css',
    // ❌ À supprimer si plus utilisé dans tes pages (héritage Bootstrap)
    // '@/public/assets/plugins/global/plugins.bundle.css',
    // '@/public/assets/css/style.bundle.css',
    '~/assets/css/Tailwind.css',
  ],

  // Réduire la charge de travail TypeScript pour accélérer le développement
  typescript: {
    typeCheck: false, // Désactiver la vérification de type en dev
    shim: false
  },
  
  // Optimisation du HMR et du rechargement de l'application
  experimental: {
    payloadExtraction: false, // Désactiver l'extraction de payload en dev
    renderJsonPayloads: false
  },
  
  // Vue
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ['client-only'].includes(tag)
    }
  },
  
  // Configuration pour résoudre les problèmes de sérialisation
  hooks: {
    'webpack:config': (configs) => {
      configs.forEach((config) => {
        if (config.name === 'server') {
          config.optimization = config.optimization || {}
          config.optimization.minimizer = []
        }
      })
    }
  },
  
  // Désactiver SSR pour le développement
  ssr: false,
  
  app: {
    head: {
      title: 'Sub Manage',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700',
        },
        {
          rel: 'stylesheet',
          href: 'https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css',
        },
      ],
      script: [
        { src: '/assets/plugins/global/plugins.bundle.js', tagPosition: 'bodyClose' },
        { src: '/assets/js/scripts.bundle.js', tagPosition: 'bodyClose' },
        { src: '/assets/plugins/custom/fullcalendar/fullcalendar.bundle.js', tagPosition: 'bodyClose' },
        { src: '/assets/js/custom/widgets.js', tagPosition: 'bodyClose' },
        { src: '/assets/js/custom/apps/chat/chat.js', tagPosition: 'bodyClose' },
        { src: '/assets/js/custom/modals/create-app.js', tagPosition: 'bodyClose' },
        { src: '/assets/js/custom/modals/upgrade-plan.js', tagPosition: 'bodyClose' },
      ],
    },
  },
})
