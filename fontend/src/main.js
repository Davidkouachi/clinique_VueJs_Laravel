import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/route/index';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura'; // Thème moderne PrimeUIX
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import initPlugin from '@/plugins/init';

import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/aura-light-blue/theme.css';
// import 'primevue/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';


// Création de l'app
const app = createApp(App);
const pinia = createPinia();

// Activation des plugins
pinia.use(piniaPersist);
app.use(pinia);
app.use(router);

// Configuration PrimeVue avec Aura
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