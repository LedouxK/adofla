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
    // '@/public/plugins/fontawesome-free/css/all.min.css',
    // '@/public/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css',
    // '@/public/plugins/icheck-bootstrap/icheck-bootstrap.min.css',
    // '@/public/plugins/jqvmap/jqvmap.min.css',
    // '@/public/plugins/overlayScrollbars/css/OverlayScrollbars.min.css',
    // '@/public/plugins/daterangepicker/daterangepicker.css',
    // '@/public/plugins/summernote/summernote-bs4.min.css',
    // '@/public/dist/css/adminlte.min.css',

    // '@/public/assets/plugins/custom/fullcalendar/fullcalendar.bundle.css',
    '@/public/assets/plugins/global/plugins.bundle.css',
    '@/public/assets/css/style.bundle.css',
    '~/assets/css/Tailwind.css',
  ],
  script: [
    // { src: '/plugins/jquery/jquery.min.js', body: true },
    // { src: '/plugins/jquery-ui/jquery-ui.min.js', body: true },
    // {
    //   children: `
    //     $.widget.bridge('uibutton', $.ui.button);
    //   `,
    //   type: 'text/javascript',
    //   body: true,
    // },
    // { src: '/plugins/bootstrap/js/bootstrap.bundle.min.js', body: true },
    // { src: '/plugins/chart.js/Chart.min.js', body: true },
    // { src: '/plugins/sparklines/sparkline.js', body: true },
    // { src: '/plugins/jqvmap/jquery.vmap.min.js', body: true },
    // { src: '/plugins/jqvmap/maps/jquery.vmap.usa.js', body: true },
    // { src: '/plugins/jquery-knob/jquery.knob.min.js', body: true },
    // { src: '/plugins/moment/moment.min.js', body: true },
    // { src: '/plugins/daterangepicker/daterangepicker.js', body: true },
    // { src: '/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js', body: true },
    // { src: '/plugins/summernote/summernote-bs4.min.js', body: true },
    // { src: '/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js', body: true },
    // { src: '/dist/js/adminlte.js', body: true },
    // { src: '/dist/js/demo.js', body: true },
    // { src: '/dist/js/pages/dashboard.js', body: true },
    // { src: '/dist/js/adminlte.min.js', body: true },

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
        // {
        //   rel: 'stylesheet',
        //   href: 'plugins/fontawesome-free/css/all.min.css',
        // },
        {
          rel: 'stylesheet',
          href: 'https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css',
        },
        // {
        //   rel: 'stylesheet',
        //   href: 'plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css',
        // },
        // {
        //   rel: 'stylesheet',
        //   href: 'plugins/icheck-bootstrap/icheck-bootstrap.min.css',
        // },
        // {
        //   rel: 'stylesheet',
        //   href: 'plugins/jqvmap/jqvmap.min.css',
        // },
        // {
        //   rel: 'stylesheet',
        //   href: 'dist/css/adminlte.min.css',
        // },
        // {
        //   rel: 'stylesheet',
        //   href: 'plugins/overlayScrollbars/css/OverlayScrollbars.min.css',
        // },
        // {
        //   rel: 'stylesheet',
        //   href: 'plugins/daterangepicker/daterangepicker.css',
        // },
        // {
        //   rel: 'stylesheet',
        //   href: 'plugins/summernote/summernote-bs4.min.css',
        // },
      ],

      script: [
        // { src: '/plugins/jquery/jquery.min.js', body: true },
        // { src: '/plugins/jquery-ui/jquery-ui.min.js', body: true },
        // {
        //   children: `
        //     $.widget.bridge('uibutton', $.ui.button);
        //   `,
        //   type: 'text/javascript',
        //   body: true,
        // },
        // { src: '/plugins/bootstrap/js/bootstrap.bundle.min.js', body: true },
        // { src: '/plugins/chart.js/Chart.min.js', body: true },
        // { src: '/plugins/sparklines/sparkline.js', body: true },
        // { src: '/plugins/jqvmap/jquery.vmap.min.js', body: true },
        // { src: '/plugins/jqvmap/maps/jquery.vmap.usa.js', body: true },
        // { src: '/plugins/jquery-knob/jquery.knob.min.js', body: true },
        // { src: '/plugins/moment/moment.min.js', body: true },
        // { src: '/plugins/daterangepicker/daterangepicker.js', body: true },
        // { src: '/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js', body: true },
        // { src: '/plugins/summernote/summernote-bs4.min.js', body: true },
        // { src: '/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js', body: true },
        // { src: '/dist/js/adminlte.js', body: true },
        // { src: '/dist/js/demo.js', body: true },
        // { src: '/dist/js/pages/dashboard.js', body: true },
        // { src: '/dist/js/adminlte.min.js', body: true },
        // { src: '/assets/plugins/global/plugins.bundle.js', body: true },
        { src: '/assets/js/scripts.bundle.js', body: true },
        // { src: '/assets/plugins/custom/fullcalendar/fullcalendar.bundle.js', body: true },
        // { src: '/assets/js/custom/widgets.js', body: true },
        // { src: '/assets/js/custom/apps/chat/chat.js', body: true },
        // { src: '/assets/js/custom/modals/create-app.js', body: true },
        // { src: '/assets/js/custom/modals/upgrade-plan.js', body: true },
      ],
    },
  },
})
