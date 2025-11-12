import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/route/index';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import 'primeicons/primeicons.css';
import initPlugin from '@/plugins/init';

import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/saga-blue/theme.css';

// Création de l'app
const app = createApp(App);
const pinia = createPinia();

// Activation des plugins
pinia.use(piniaPersist);
app.use(pinia);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark',
    },
  },
});
app.use(ToastService);
app.component('Toast', Toast);
app.use(ConfirmationService);
app.use(initPlugin);

app.mount('#app');




// import { createApp } from 'vue';
// import App from '@/App.vue';
// import router from '@/route/index';
// import { createPinia } from 'pinia';
// import piniaPersist from 'pinia-plugin-persistedstate';
// import PrimeVue from 'primevue/config';
// import Aura from '@primeuix/themes/aura';
// import ConfirmationService from 'primevue/confirmationservice';
// import ToastService from 'primevue/toastservice';
// import Toast from 'primevue/toast';

// import 'primeicons/primeicons.css';
// import 'primevue/resources/primevue.min.css';
// import 'primevue/resources/themes/saga-blue/theme.css';

// import initPlugin from '@/plugins/init';
// import DataTable from 'primevue/datatable';
// import Column from 'primevue/column';

// const app = createApp(App);
// const pinia = createPinia();

// pinia.use(piniaPersist);
// app.use(pinia);
// app.use(router);
// app.use(PrimeVue, {
//   theme: {
//     preset: Aura,
//     options: {
//       darkModeSelector: '.app-dark',
//     },
//   },
// });
// app.use(ToastService);
// app.component('Toast', Toast);
// app.use(ConfirmationService);
// app.use(initPlugin);

// app.component('DataTable', DataTable);
// app.component('Column', Column);

// app.mount('#app');
