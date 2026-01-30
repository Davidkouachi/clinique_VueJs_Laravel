import { ref, onMounted } from 'vue';

export const model = ref([
    {
        // label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/', permissions: ['admin', 'user'], }]
    },
    {
        label: 'Personnel',
        items: [
            { label: 'Nouvel utilisateur', icon: 'pi pi-plus', to: '/Nouvel_utilisateur', permissions: ['admin', 'user'], },
            { label: 'Liste utilisateur', icon: 'pi pi-list', to: '/List_utilisateur', permissions: ['admin', 'user'], },
            {
                label: 'Elements',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    { label: 'Basic', icon: 'pi pi-list', to: '/element_basic', permissions: ['admin', 'user'], },
                    { label: 'Graphique', icon: 'pi pi-chart-bar', to: '/element_chart', permissions: ['admin', 'user'], },
                    { label: 'Calendrier', icon: 'pi pi-calendar', to: '/element_calendrier', permissions: ['admin', 'user'], },
                    { label: 'Carte', icon: 'pi pi-map', to: '/element_carte', permissions: ['admin', 'user'], },
                    { label: 'Produit', icon: 'pi pi-table', to: '/element_produit', permissions: ['admin', 'user'], },
                ]
            },
        ]
    },
    {
        label: 'Administration',
        icon: 'pi pi-fw pi-building',
        items: [
            /* ===================== PATIENTS ===================== */
            {
                label: 'Patients',
                icon: 'pi pi-fw pi-users',
                items: [
                    { label: 'Nouveau patient', icon: 'pi pi-plus', to: '/patients/create', permissions: ['admin','user'] },
                    { label: 'Liste des patients', icon: 'pi pi-list', to: '/patients', permissions: ['admin','user'] },
                    { label: 'Dossiers médicaux', icon: 'pi pi-folder', to: '/patients/dossiers', permissions: ['admin','medecin'] },
                ]
            },

            /* ===================== PATIENTS ===================== */
            {
                label: 'Assurances',
                icon: 'pi pi-fw pi-address-book',
                items: [
                    { label: 'Nouvelle assurance', icon: 'pi pi-file-plus', to: '/patients/create', permissions: ['admin','user'] },
                    { label: 'Liste des assurances', icon: 'pi pi-list', to: '/patients', permissions: ['admin','user'] },
                ]
            },

            /* ===================== MEDECINS ===================== */
            {
                label: 'Médecins',
                icon: 'pi pi-fw pi-users',
                items: [
                    { label: 'Nouveau médecin', icon: 'pi pi-user-plus', to: '/medecins/create', permissions: ['admin'] },
                    { label: 'Liste des médecins', icon: 'pi pi-list', to: '/medecins', permissions: ['admin'] },
                    { label: 'Spécialités', icon: 'pi pi-briefcase', to: '/medecins/specialites', permissions: ['admin'] },
                    { label: 'Horaires', icon: 'pi pi-calendar', to: '/medecins/horaires', permissions: ['admin','medecin'] },
                    { label: 'Rapport d’activité', icon: 'pi pi-chart-line', to: '/medecins/rapports', permissions: ['admin','medecin'] },
                ]
            },

            /* ===================== RENDEZ-VOUS ===================== */
            {
                label: 'Rendez-vous',
                icon: 'pi pi-fw pi-calendar-clock',
                items: [
                    { label: 'Nouveau RDV', icon: 'pi pi-plus', to: '/rdv/create', permissions: ['admin','user'] },
                    { label: 'Agenda', icon: 'pi pi-calendar', to: '/rdv/agenda', permissions: ['admin','medecin'] },
                    { label: 'Liste des RDV', icon: 'pi pi-list', to: '/rdv', permissions: ['admin','user'] },
                ]
            },
        ]
    },
    /* ===================== ACTES MEDICAUX ===================== */
    {
        label: 'Actes Médicaux',
        icon: 'pi pi-fw pi-bookmark',
        items: [
            {
                label: 'Consultations',
                icon: 'pi pi-fw pi-user',
                items: [
                    { label: 'Nouvelle consultation', icon: 'pi pi-plus', to: '/consultations/create', permissions: ['medecin'] },
                    { label: 'Liste des consultations', icon: 'pi pi-list', to: '/consultations', permissions: ['admin','medecin'] },
                    { label: 'Types & tarifs', icon: 'pi pi-money-bill', to: '/consultations/types', permissions: ['admin'] },
                ]
            },
            {
                label: 'Examens',
                icon: 'pi pi-fw pi-search',
                items: [
                    { label: 'Nouvel examen', icon: 'pi pi-plus', to: '/examens/create', permissions: ['medecin','user'] },
                    { label: 'Biologie / Analyses', icon: 'pi pi-sliders-h', to: '/examens/biologie', permissions: ['admin','user'] },
                    { label: 'Imagerie', icon: 'pi pi-camera', to: '/examens/imagerie', permissions: ['admin','user'] },
                    { label: 'Tarifs examens', icon: 'pi pi-money-bill', to: '/examens/tarifs', permissions: ['admin'] },
                ]
            },
            {
                label: 'Soins ambulatoires',
                icon: 'pi pi-fw pi-heart',
                items: [
                    { label: 'Nouveau soin', icon: 'pi pi-plus', to: '/soins/create', permissions: ['infirmier'] },
                    { label: 'Liste des soins', icon: 'pi pi-list', to: '/soins', permissions: ['admin','infirmier'] },
                    { label: 'Tarifs soins', icon: 'pi pi-money-bill', to: '/soins/tarifs', permissions: ['admin'] },
                ]
            },
            {
                label: 'Hospitalisation',
                icon: 'pi pi-fw pi-home',
                items: [
                    { label: 'Nouvelle hospitalisation', icon: 'pi pi-plus', to: '/hospitalisations/create', permissions: ['admin'] },
                    { label: 'Patients hospitalisés', icon: 'pi pi-list', to: '/hospitalisations', permissions: ['admin','medecin'] },
                    { label: 'Chambres & Lits', icon: 'pi pi-building', to: '/hospitalisations/chambres' },
                    { label: 'Prestations', icon: 'pi pi-briefcase', to: '/hospitalisations/prestations', permissions: ['admin'] },
                ]
            },
        ]
    },
    /* ===================== FACTURATION ===================== */
    {
        label: 'Facturation',
        icon: 'pi pi-fw pi-file',
        items: [
            { label: 'liste des Factures', icon: 'pi pi-list', to: '/finance/factures', permissions: ['admin'] },
            { label: 'Factures impayées', icon: 'pi pi-exclamation-circle', to: '/finance/factures/impayees', permissions: ['admin'] },
            { label: 'Avoirs', icon: 'pi pi-refresh', to: '/finance/avoirs', permissions: ['admin'] },
        ]
    },
    {
        label: 'Finances & Comptabilité',
        icon: 'pi pi-fw pi-wallet',
        items: [

            /* ===================== TABLEAU DE BORD ===================== */
            {
                label: 'Tableau financier',
                icon: 'pi pi-fw pi-chart-pie',
                to: '/finance/dashboard',
                permissions: ['admin']
            },

            /* ===================== CAISSE ===================== */
            {
                label: 'Caisse',
                icon: 'pi pi-fw pi-credit-card',
                items: [
                    { 
                        label: 'Nouvel encaissement',
                        icon: 'pi pi-plus',
                        to: '/finance/encaissements/create',
                        permissions: ['admin', 'caissier']
                    },
                    { 
                        label: 'Encaissements',
                        icon: 'pi pi-list',
                        to: '/finance/encaissements',
                        permissions: ['admin', 'caissier']
                    },
                    { 
                        label: 'Clôture de caisse',
                        icon: 'pi pi-lock',
                        to: '/finance/caisse/cloture',
                        permissions: ['admin', 'caissier']
                    },
                    { 
                        label: 'Journal de caisse',
                        icon: 'pi pi-book',
                        to: '/finance/caisse/journal',
                        permissions: ['admin']
                    },
                ]
            },

            /* ===================== OPÉRATIONS DE CAISSE ===================== */
            {
                label: 'Opérations de caisse',
                icon: 'pi pi-fw pi-arrows-v',
                items: [
                    { 
                        label: 'Nouvelle opération',
                        icon: 'pi pi-plus',
                        to: '/finance/operations/create',
                        permissions: ['admin']
                    },
                    { 
                        label: 'Liste des opérations',
                        icon: 'pi pi-list',
                        to: '/finance/operations',
                        permissions: ['admin']
                    },
                ]
            },

            /* ===================== ASSURANCES ===================== */
            {
                label: 'Assurances & Tiers payant',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    { 
                        label: 'Prises en charge',
                        icon: 'pi pi-check-square',
                        to: '/finance/prises-en-charge',
                        permissions: ['admin', 'caissier']
                    },
                ]
            },

            /* ===================== RESSOURCES HUMAINES ===================== */
            {
                label: 'Salaires & Honoraires',
                icon: 'pi pi-fw pi-users',
                items: [
                    { 
                        label: 'Honoraires médecins',
                        icon: 'pi pi-user-md',
                        to: '/finance/honoraires',
                        permissions: ['admin']
                    },
                    { 
                        label: 'Salaires du personnel',
                        icon: 'pi pi-users',
                        to: '/finance/salaires',
                        permissions: ['admin']
                    },
                ]
            },

            /* ===================== RAPPORTS ===================== */
            {
                label: 'Rapports financiers',
                icon: 'pi pi-fw pi-chart-line',
                items: [
                    { 
                        label: 'Recettes journalières',
                        icon: 'pi pi-calendar',
                        to: '/finance/rapports/recettes',
                        permissions: ['admin', 'caissier']
                    },
                    { 
                        label: 'Dépenses',
                        icon: 'pi pi-arrow-down',
                        to: '/finance/rapports/depenses',
                        permissions: ['admin']
                    },
                    { 
                        label: 'Résultat financier',
                        icon: 'pi pi-chart-bar',
                        to: '/finance/rapports/resultat',
                        permissions: ['admin']
                    },
                ]
            },
        ]
    },

    /* ===================== PHARMACIE ===================== */
    {
        label: 'Pharmacie',
        icon: 'pi pi-fw pi-box',
        items: [
            { label: 'Produits', icon: 'pi pi-list', to: '/pharmacie/produits', permissions: ['admin','pharmacien'] },
            { label: 'Stock', icon: 'pi pi-database', to: '/pharmacie/stock', permissions: ['admin','pharmacien'] },
            { label: 'Sorties médicaments', icon: 'pi pi-arrow-right', to: '/pharmacie/sorties', permissions: ['admin','pharmacien'] },
        ]
    },

    /* ===================== RAPPORTS ===================== */
    {
        label: 'Rapports & Statistiques',
        icon: 'pi pi-fw pi-chart-bar',
        items: [
            { label: 'Rapports des actes', icon: 'pi pi-chart-line', to: '/rapports/activite', permissions: ['admin'] },
            { label: 'Recettes', icon: 'pi pi-money-bill', to: '/rapports/financier', permissions: ['admin'] },
            {
                label: 'États des actes',
                icon: 'pi pi-fw pi-file-pdf',
                items: [
                    { label: 'En attente', icon: 'pi pi-clock' },
                    { label: 'En cours', icon: 'pi pi-spinner' },
                    { label: 'Terminé', icon: 'pi pi-check-circle' },
                    { label: 'Annulé', icon: 'pi pi-times-circle' },
                    { label: 'Facturé', icon: 'pi pi-money-bill' },
                ]
            }
        ]
    },

    /* ===================== PARAMETRES ===================== */
    {
        label: 'Configurations',
        icon: 'pi pi-fw pi-cog',
        items: [
            { label: 'Utilisateurs & rôles', icon: 'pi pi-users', to: '/configurations/utilisateurs', permissions: ['admin'] },
            { label: 'Historiques activitées', icon: 'pi pi-history', to: '/configurations/utilisateurs', permissions: ['admin'] },
            { label: 'Parametre', icon: 'pi pi-sliders-h', to: '/configurations/parametre', permissions: ['admin'] },
        ]
    },

]);

export function findBreadcrumb(menu, to, path = []) {
  for (const item of menu) {
    const currentPath = [...path, { label: item.label, icon: item.icon, to: item.to }];
    if (item.to === to) return currentPath;
    if (item.items) {
      const found = findBreadcrumb(item.items, to, currentPath);
      if (found) return found;
    }
  }
  return null;
}