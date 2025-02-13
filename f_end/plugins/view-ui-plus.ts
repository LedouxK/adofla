// plugins/view-ui-plus.ts

import { defineNuxtPlugin } from '#app';
import ViewUIPlus from 'view-ui-plus';
import 'view-ui-plus/dist/styles/viewuiplus.css';
import locale from 'view-ui-plus/dist/locale/en-US';
import ElementPlus from 'element-plus'

export default defineNuxtPlugin((nuxtApp) => {
  // Register ViewUIPlus as a global plugin
  nuxtApp.vueApp.use(ViewUIPlus, {locale: locale}).use(ElementPlus, { size: 'small', zIndex: 3000 });
});
