// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@element-plus/nuxt', '@pinia/nuxt'],

  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

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
