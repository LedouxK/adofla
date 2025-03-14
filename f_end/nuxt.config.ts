// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@element-plus/nuxt', '@pinia/nuxt'],
  // pinia: {
  //   storesDirs: ['./stores/**', './custom-folder/stores/**'],
  // },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  plugins: [
    // '~/plugins/axios.ts', 
    '~/plugins/view-ui-plus.ts',
  ],
  css: [
    'view-ui-plus/dist/styles/viewuiplus.css',
    // Suppression des commentaires relatifs à Bootstrap
    '@/public/assets/plugins/global/plugins.bundle.css',
    '@/public/assets/css/style.bundle.css',
    '~/assets/css/Tailwind.css',
  ],
  script: [
    // Suppression des commentaires relatifs à Bootstrap
    { src: '/assets/plugins/global/plugins.bundle.js', body: true },
    { src: '/assets/js/scripts.bundle.js', body: true },
    { src: '/assets/plugins/custom/fullcalendar/fullcalendar.bundle.js', body: true },
    { src: '/assets/js/custom/widgets.js', body: true },
    { src: '/assets/js/custom/apps/chat/chat.js', body: true },
    { src: '/assets/js/custom/modals/create-app.js', body: true },
    { src: '/assets/js/custom/modals/upgrade-plan.js', body: true },
  ],
  app: {
    head: {
      title: "Sub Manage",
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700',
        },
        // Suppression des commentaires relatifs à Bootstrap
        {
          rel: 'stylesheet',
          href: 'https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css',
        },
      ],

      script: [
        // Suppression des commentaires relatifs à Bootstrap
        { src: '/assets/js/scripts.bundle.js', body: true },
      ],
    },
  },
})