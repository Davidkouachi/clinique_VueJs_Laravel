import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import { createPinia, setActivePinia  } from 'pinia';

import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';

import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import Rating from 'primevue/rating';

import '@/assets/styles.scss';
import '@/assets/style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    },
    locale: {
        startsWith: 'Commence par',
        contains: 'Contient',
        notContains: 'Ne contient pas',
        endsWith: 'Se termine par',
        equals: 'Égale',
        notEquals: 'Différent',
        noFilter: 'Aucun filtre',
        lt: 'Inférieur à',
        lte: 'Inférieur ou égal à',
        gt: 'Supérieur à',
        gte: 'Supérieur ou égal à',
        dateIs: 'Date égale',
        dateIsNot: 'Date différente',
        dateBefore: 'Avant',
        dateAfter: 'Après',
        clear: 'Effacer',
        apply: 'Appliquer',
        matchAll: 'Correspond à tout',
        matchAny: 'Correspond à au moins un',
        addRule: 'Ajouter une règle',
        removeRule: 'Supprimer la règle',
        accept: 'Oui',
        reject: 'Non',
        choose: 'Choisir',
        upload: 'Téléverser',
        cancel: 'Annuler',
        dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
        dayNamesShort: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
        dayNamesMin: ['D','L','M','M','J','V','S'],
        monthNames: [
            'Janvier','Février','Mars','Avril','Mai','Juin',
            'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
        ],
        monthNamesShort: [
            'Janv','Févr','Mars','Avr','Mai','Juin',
            'Juil','Août','Sept','Oct','Nov','Déc'
        ],
        today: 'Aujourd’hui',
        weekHeader: 'Sem',
        firstDayOfWeek: 1,
        dateFormat: 'dd/mm/yy',
        weak: 'Faible',
        medium: 'Moyen',
        strong: 'Fort',
        passwordPrompt: 'Entrer un mot de passe'
    }
});

app.component('Toast', Toast);
app.component('ProgressSpinner', ProgressSpinner);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Button', Button);
app.component('InputText', InputText);
app.component('Dialog', Dialog);
app.component('Rating', Rating);

app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
