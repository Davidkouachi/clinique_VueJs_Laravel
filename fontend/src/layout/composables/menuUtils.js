import { ref, onMounted } from 'vue';

export const model = ref([
    {
        // label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/', permissions: ['administrateur', 'user'], }]
    },
    {
        label: 'Personnel',
        items: [
            { label: 'Nouvel utilisateur', icon: 'pi pi-plus', to: '/Nouvel_utilisateur', permissions: ['administrateur', 'user'], },
            { label: 'Liste utilisateur', icon: 'pi pi-list', to: '/List_utilisateur', permissions: ['administrateur', 'user'], },
            {
                label: 'Elements',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    { label: 'Basic', icon: 'pi pi-list', to: '/element_basic', permissions: ['administrateur', 'user'], },
                    { label: 'Graphique', icon: 'pi pi-chart-bar', to: '/element_chart', permissions: ['administrateur', 'user'], },
                    { label: 'Calendrier', icon: 'pi pi-calendar', to: '/element_calendrier', permissions: ['administrateur', 'user'], },
                    { label: 'Carte', icon: 'pi pi-map', to: '/element_carte', permissions: ['administrateur', 'user'], },
                    { label: 'Produit', icon: 'pi pi-table', to: '/element_produit', permissions: ['administrateur', 'user'], },
                ]
            },
        ]
    },
    {
        label: 'administrateuristration',
        icon: 'pi pi-fw pi-building',
        items: [
            /* ===================== PATIENTS ===================== */
            {
                label: 'Patients',
                icon: 'pi pi-fw pi-users',
                items: [
                    { label: 'Nouveau patient', icon: 'pi pi-plus', to: '/patients/create', permissions: ['administrateur','user'] },
                    { label: 'Liste des patients', icon: 'pi pi-list', to: '/patients', permissions: ['administrateur','user'] },
                    { label: 'Dossiers médicaux', icon: 'pi pi-folder', to: '/patients/dossiers', permissions: ['administrateur','medecin'] },
                ]
            },

            /* ===================== PATIENTS ===================== */
            {
                label: 'Assurances',
                icon: 'pi pi-fw pi-address-book',
                items: [
                    { label: 'Nouvelle assurance', icon: 'pi pi-file-plus', to: '/patients/create', permissions: ['administrateur','user'] },
                    { label: 'Liste des assurances', icon: 'pi pi-list', to: '/patients', permissions: ['administrateur','user'] },
                ]
            },

            /* ===================== MEDECINS ===================== */
            {
                label: 'Médecins',
                icon: 'pi pi-fw pi-users',
                items: [
                    { label: 'Nouveau médecin', icon: 'pi pi-user-plus', to: '/medecins/create', permissions: ['administrateur'] },
                    { label: 'Liste des médecins', icon: 'pi pi-list', to: '/medecins', permissions: ['administrateur'] },
                    { label: 'Spécialités', icon: 'pi pi-briefcase', to: '/medecins/specialites', permissions: ['administrateur'] },
                    { label: 'Horaires', icon: 'pi pi-calendar', to: '/medecins/horaires', permissions: ['administrateur','medecin'] },
                    { label: 'Rapport d’activité', icon: 'pi pi-chart-line', to: '/medecins/rapports', permissions: ['administrateur','medecin'] },
                ]
            },

            /* ===================== RENDEZ-VOUS ===================== */
            {
                label: 'Rendez-vous',
                icon: 'pi pi-fw pi-calendar-clock',
                items: [
                    { label: 'Nouveau RDV', icon: 'pi pi-plus', to: '/rdv/create', permissions: ['administrateur','user'] },
                    { label: 'Agenda', icon: 'pi pi-calendar', to: '/rdv/agenda', permissions: ['administrateur','medecin'] },
                    { label: 'Liste des RDV', icon: 'pi pi-list', to: '/rdv', permissions: ['administrateur','user'] },
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
                    { label: 'Liste des consultations', icon: 'pi pi-list', to: '/consultations', permissions: ['administrateur','medecin'] },
                    { label: 'Types & tarifs', icon: 'pi pi-money-bill', to: '/consultations/types', permissions: ['administrateur'] },
                ]
            },
            {
                label: 'Examens',
                icon: 'pi pi-fw pi-search',
                items: [
                    { label: 'Nouvel examen', icon: 'pi pi-plus', to: '/examens/create', permissions: ['medecin','user'] },
                    { label: 'Biologie / Analyses', icon: 'pi pi-sliders-h', to: '/examens/biologie', permissions: ['administrateur','user'] },
                    { label: 'Imagerie', icon: 'pi pi-camera', to: '/examens/imagerie', permissions: ['administrateur','user'] },
                    { label: 'Tarifs examens', icon: 'pi pi-money-bill', to: '/examens/tarifs', permissions: ['administrateur'] },
                ]
            },
            {
                label: 'Soins ambulatoires',
                icon: 'pi pi-fw pi-heart',
                items: [
                    { label: 'Nouveau soin', icon: 'pi pi-plus', to: '/soins/create', permissions: ['infirmier'] },
                    { label: 'Liste des soins', icon: 'pi pi-list', to: '/soins', permissions: ['administrateur','infirmier'] },
                    { label: 'Tarifs soins', icon: 'pi pi-money-bill', to: '/soins/tarifs', permissions: ['administrateur'] },
                ]
            },
            {
                label: 'Hospitalisation',
                icon: 'pi pi-fw pi-home',
                items: [
                    { label: 'Nouvelle hospitalisation', icon: 'pi pi-plus', to: '/hospitalisations/create', permissions: ['administrateur'] },
                    { label: 'Patients hospitalisés', icon: 'pi pi-list', to: '/hospitalisations', permissions: ['administrateur','medecin'] },
                    { label: 'Chambres & Lits', icon: 'pi pi-building', to: '/hospitalisations/chambres' },
                    { label: 'Prestations', icon: 'pi pi-briefcase', to: '/hospitalisations/prestations', permissions: ['administrateur'] },
                ]
            },
        ]
    },
    /* ===================== FACTURATION ===================== */
    {
        label: 'Facturation',
        icon: 'pi pi-fw pi-file',
        items: [
            { label: 'liste des Factures', icon: 'pi pi-list', to: '/finance/factures', permissions: ['administrateur'] },
            { label: 'Factures impayées', icon: 'pi pi-exclamation-circle', to: '/finance/factures/impayees', permissions: ['administrateur'] },
            { label: 'Avoirs', icon: 'pi pi-refresh', to: '/finance/avoirs', permissions: ['administrateur'] },
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
                permissions: ['administrateur']
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
                        permissions: ['administrateur', 'caissier']
                    },
                    { 
                        label: 'Encaissements',
                        icon: 'pi pi-list',
                        to: '/finance/encaissements',
                        permissions: ['administrateur', 'caissier']
                    },
                    { 
                        label: 'Clôture de caisse',
                        icon: 'pi pi-lock',
                        to: '/finance/caisse/cloture',
                        permissions: ['administrateur', 'caissier']
                    },
                    { 
                        label: 'Journal de caisse',
                        icon: 'pi pi-book',
                        to: '/finance/caisse/journal',
                        permissions: ['administrateur']
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
                        permissions: ['administrateur']
                    },
                    { 
                        label: 'Liste des opérations',
                        icon: 'pi pi-list',
                        to: '/finance/operations',
                        permissions: ['administrateur']
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
                        permissions: ['administrateur', 'caissier']
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
                        permissions: ['administrateur']
                    },
                    { 
                        label: 'Salaires du personnel',
                        icon: 'pi pi-users',
                        to: '/finance/salaires',
                        permissions: ['administrateur']
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
                        permissions: ['administrateur', 'caissier']
                    },
                    { 
                        label: 'Dépenses',
                        icon: 'pi pi-arrow-down',
                        to: '/finance/rapports/depenses',
                        permissions: ['administrateur']
                    },
                    { 
                        label: 'Résultat financier',
                        icon: 'pi pi-chart-bar',
                        to: '/finance/rapports/resultat',
                        permissions: ['administrateur']
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
            { label: 'Produits', icon: 'pi pi-list', to: '/pharmacie/produits', permissions: ['administrateur','pharmacien'] },
            { label: 'Stock', icon: 'pi pi-database', to: '/pharmacie/stock', permissions: ['administrateur','pharmacien'] },
            { label: 'Sorties médicaments', icon: 'pi pi-arrow-right', to: '/pharmacie/sorties', permissions: ['administrateur','pharmacien'] },
        ]
    },

    /* ===================== RAPPORTS ===================== */
    {
        label: 'Rapports & Statistiques',
        icon: 'pi pi-fw pi-chart-bar',
        items: [
            { label: 'Rapports des actes', icon: 'pi pi-chart-line', to: '/rapports/activite', permissions: ['administrateur'] },
            { label: 'Recettes', icon: 'pi pi-money-bill', to: '/rapports/financier', permissions: ['administrateur'] },
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
            {
                label: 'Utilisateurs & rôles',
                icon: 'pi pi-users',
                items: [
                    { label: 'Utilisateurs', icon: 'pi pi-user', to: '/configurations/utilisateurs', permissions: ['administrateur']},
                    { label: 'Rôles', icon: 'pi pi-id-card', to: '/configurations/roles', permissions: ['administrateur']},
                ]
            },
            { label: 'Historiques activitées', icon: 'pi pi-history', to: '/configurations/activites', permissions: ['administrateur'] },
            { label: 'Parametre', icon: 'pi pi-sliders-h', to: '/configurations/parametres', permissions: ['administrateur'] },
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