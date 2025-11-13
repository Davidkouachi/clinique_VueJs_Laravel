import { createRouter, createWebHistory } from 'vue-router';

import NotFound from '@/pages/NotFound.vue';
import Maintenance from '@/pages/Maintenance.vue';

import Login from '@/pages/auth/login.vue';
import User from '@/pages/User.vue';
import Home from '@/pages/Home.vue';
import About from '@/pages/About.vue';

import Select2 from '@/pages/item/Select2/select2.vue';
import PrimeVueSelect from '@/pages/item/Select2/PrimeVueSelect.vue';
import DataTable from '@/pages/item/DataTable/datatable.vue';
import PrimeVueTable from '@/pages/item/DataTable/PrimeVueTable.vue';
import CodeQr from '@/pages/item/CodeQr.vue';
import Graphique from '@/pages/item/Graphique.vue';


import { useAuthStore } from '@/stores/auth';

const routes = [
  { path: '/authentification', name: 'Login', component: Login, meta: { title: 'Login' } },
  { path: '/', name: 'Home', component: Home, meta: { title: 'Accueil', requiresAuth: true } },
  { path: '/user', name: 'User', component: User, meta: { title: 'Utilisateurs', requiresAuth: true } },
  { path: '/about', name: 'About', component: About, meta: { title: 'À propos', requiresAuth: true } },

  { path: '/select2', name: 'Select2', component: Select2, meta: { title: 'Select2', requiresAuth: true } },
  { path: '/primeVueSelect', name: 'PrimeVueSelect', component: PrimeVueSelect, meta: { title: 'PrimeVueSelect', requiresAuth: true } },
  { path: '/datatable', name: 'DataTable', component: DataTable, meta: { title: 'DataTable', requiresAuth: true } },
  { path: '/primeVueTable', name: 'PrimeVueTable', component: PrimeVueTable, meta: { title: 'PrimeVueTable', requiresAuth: true } },
  { path: '/code-qr', name: 'CodeQr', component: CodeQr, meta: { title: 'CodeQr', requiresAuth: true } },
  { path: '/graphique', name: 'Graphique', component: Graphique, meta: { title: 'Graphique', requiresAuth: true } },

  { path: '/maintenance', name: 'Maintenance', component: Maintenance, meta: { title: 'Maintenance', requiresAuth: true } },
  // 🚨 Route 404 (toujours en dernier)
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { title: 'Page introuvable' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // ✅ Tente de restaurer la session si non chargée
  if (!auth.expired) {
    await auth.restoreSession();
  }

  // 🟢 Si connecté et qu’on tente d’aller sur /authentification
  if (to.name === 'Login' && auth.isAuthenticated) {
    return next({ name: 'Home' });
  }

  // 🔒 Si la route est protégée et l’utilisateur non authentifié
  if (to.meta?.requiresAuth && (!auth.isAuthenticated || auth.expired)) {
    auth.logoutLocal(true);
    return next({ name: 'Login' });
  }

  // 🏷️ Mise à jour du titre
  document.title = `${to.meta?.title ?? 'Page'} | Sogamad Santé`;

  next();
});

export default router;
