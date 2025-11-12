<template>
    <div class="sidebar" id="sidebar">
            
        <!-- Start Logo -->
        <div class="sidebar-logo d-flex flex-column justify-cintent-center align-items-center border-0">
            <div>
                <!-- Logo Normal -->
                <a href="#" class="logo logo-normal">
                  <img height="50" width="50" src="@/assets/img/logo.png" alt="Logo">
                  <!-- <span class="avatar rounded-circle flex-shrink-0 p-0">
                    <img src="@/assets/img/home1.jpg" alt="img">
                  </span> -->
                </a>

                <!-- Logo Small -->
                <a href="#" class="logo-small">
                  <img src="@/assets/img/logo.png" alt="Logo">
                  <!-- <span class="avatar rounded-circle flex-shrink-0 p-0">
                    <img src="@/assets/img/home1.jpg" alt="img">
                  </span> -->
                </a>

                <!-- Logo Dark -->
                <a href="#" class="dark-logo">
                  <img height="40" width="50" src="@/assets/img/logo.png" alt="Logo">
                  <!-- <span class="avatar rounded-circle flex-shrink-0 p-0">
                    <img src="@/assets/img/home1.jpg" alt="img">
                  </span> -->
                </a>
            </div>

            <!-- Sidebar Menu Close -->
            <button class="sidenav-toggle-btn btn border-0 p-0 active" id="toggle_btn"> 
                <i class="ti ti-arrow-left"></i>
            </button>
            <button class="sidebar-close">
                <i class="ti ti-x align-middle"></i>
            </button>              
        </div>
        <!-- End Logo -->

        <!-- Sidenav Menu -->
        <div class="sidebar-inner" data-simplebar>                
            <div id="sidebar-menu" class="sidebar-menu">
                <div class="sidebar-top shadow-sm p-2 rounded-1 mb-3 dropend bg-danger">
                    <a href="javascript:void(0);" class="drop-arrow-none">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                <span class="avatar rounded-circle flex-shrink-0 p-0">
                                    <img src="@/assets/img/home1.jpg" alt="img">
                                </span>
                                <div class="ms-2">
                                    <h6 class="fs-14 fw-semibold mb-0 text-white">
                                        ESPACE MEDICALE
                                    </h6>
                                    <!-- <p class="fs-10 mb-0 text-white">
                                      {{ user?.login || 'Invité' }}
                                    </p> -->
                                    <p class="fs-10 mb-0 text-white">
                                      {{ auth.user?.email || 'Invité' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
                <!-- <div class="alert alert-warning text-bg-warning" role="alert">
                    <strong>
                        Bon(s) en stock : 0
                        <br> 
                        Bon(s) uilisé(s) : 0
                    </strong>
                </div> -->
                <ul>
                  <li class="menu-title"><span>Menu</span></li>

                  <li>
                    <ul>
                      <template v-for="(item, index) in filteredMenu" :key="index">
                        
                        <!-- 🌟 MENU SANS ENFANTS -->
                        <li v-if="!item.children" :id="item.id">
                          <router-link
                            :to="item.to"
                            active-class="active"
                            custom
                            v-slot="{ href, isActive }"
                          >
                            <a
                              :href="href"
                              :class="{ active: isActive || activeTemp === item.to }"
                              @click.prevent="navigateWithPreloader(item.to)"
                            >
                              <i :class="item.icon"></i>
                              <span>{{ item.label }}</span>
                            </a>
                          </router-link>
                        </li>

                        <!-- 🌟 MENU AVEC SOUS-MENUS -->
                        <li v-else class="submenu" :id="item.id">
                          <a href="javascript:void(0);">
                            <i :class="item.icon"></i>
                            <span>{{ item.label }}</span>
                            <span class="menu-arrow"></span>
                          </a>

                          <ul>
                            <template v-for="(child, cIndex) in item.children" :key="cIndex">
                              
                              <!-- 🔹 SOUS-MENU SIMPLE -->
                              <li v-if="!child.children" :id="child.id">
                                <router-link
                                  :to="child.to"
                                  active-class="active"
                                  custom
                                  v-slot="{ href, isActive }"
                                >
                                  <a
                                    :href="href"
                                    :class="{ active: isActive || activeTemp === child.to }"
                                    @click.prevent="navigateWithPreloader(child.to)"
                                  >
                                    {{ child.label }}
                                  </a>
                                </router-link>
                              </li>

                              <!-- 🔹 SOUS-MENU AVEC ENFANTS (si nécessaire) -->
                              <li v-else class="submenu submenu-two" :id="child.id">
                                <a href="javascript:void(0);">
                                  <span>{{ child.label }}</span>
                                  <span class="menu-arrow"></span>
                                </a>
                                <ul>
                                  <template v-for="(subChild, sIndex) in child.children" :key="sIndex">
                                    <li :id="subChild.id">
                                      <router-link
                                        :to="subChild.to"
                                        active-class="active"
                                        custom
                                        v-slot="{ href, isActive }"
                                      >
                                        <a
                                          :href="href"
                                          :class="{ active: isActive || activeTemp === subChild.to }"
                                          @click.prevent="navigateWithPreloader(subChild.to)"
                                        >
                                          {{ subChild.label }}
                                        </a>
                                      </router-link>
                                    </li>
                                  </template>
                                </ul>
                              </li>

                            </template>
                          </ul>
                        </li>

                      </template>
                    </ul>
                  </li>
                </ul>  
            </div>
            <div class="sidebar-footer border-top mt-3">
                <div class="trial-item mt-0 p-3 text-center">
                    <div class="trial-item-icon rounded-4 mb-3 p-2 text-center shadow-sm d-inline-flex">
                        <img height="60" width="110" src="@/assets/img/logo.png" alt="img">
                    </div>
                    <div>
                        <span class="badge bg-danger ms-2 badge-md rounded-2 fs-12 fw-semibold p-1 mb-2">
                            Version 1.07.25
                        </span>
                        <p class="fs-13 mb-0">
                            Aucune information sensible ou à caractère personnel n’est exploitée.
                        </p>
                    </div>
                    <a href="javascript:void(0);" class="close-icon shadow-sm">
                        <i class="ti ti-x"></i>
                    </a>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import router from "@/route/index";
import { usePreloaderStore } from "@/stores/preloader";

const preloader = usePreloaderStore();
const auth = useAuthStore();
const activeTemp = ref(null); // 💡 active temporaire

// Menu principal avec permissions
const menuItems = [
  {
    id: 'menu-home',
    label: 'Home',
    icon: 'fa fa-th-large',
    to: '/',
    permissions: ['admin', 'user'],
  },
  {
    id: 'menu-user',
    label: 'User',
    icon: 'fa fa-user',
    to: '/User',
    permissions: ['admin', 'user'],
  },
  {
    id: 'menu-about',
    label: 'About',
    icon: 'fa fa-th-large',
    to: '/about',
    permissions: ['admin', 'user'],
  },
  {
    id: 'menu-items',
    label: 'Items',
    icon: 'ti ti-apps',
    permissions: ['admin', 'user'],
    children: [
      { id: 'submenu-select2', label: 'Select2', to: '/select2', permissions: ['admin', 'user'] },
      {
        id: 'submenu-Table',
        label: 'Table',
        permissions: ['admin', 'user'],
        children: [
          { id: 'submenu-datatable', label: 'DataTable', to: '/datatable', permissions: ['admin', 'user'] },
          { id: 'submenu-primeVueTable', label: 'PrimeVueTable', to: '/primeVueTable', permissions: ['admin', 'user'] },
        ],
      },
      { id: 'submenu-codeqr', label: 'CodeQr', to: '/code-qr', permissions: ['admin', 'user'] },
      { id: 'submenu-graphique', label: 'Graphique', to: '/graphique', permissions: ['admin', 'user'] },
    ],
  },
  {
    id: 'menu-applications',
    label: 'Applications',
    icon: 'ti ti-apps',
    permissions: ['admin', 'user'],
    children: [
      {
        id: 'submenu-maintenance',
        label: 'Maintenance',
        permissions: ['admin', 'user'],
        children: [
          { id: 'submenu-m-style1', label: 'Style 1', to: '/maintenance', permissions: ['admin', 'user'] },
        ],
      },
    ],
  },
];

// 🌟 Navigation + preloader + effet "active"
function navigateWithPreloader(to) {
  closeSidebar();

  // Active visuellement tout de suite
  activeTemp.value = to;

  // Trouver l'ID correspondant dans menuItems
  function findId(items, targetTo) {
    for (let item of items) {
      if (item.to === targetTo) return item.id;
      if (item.children) {
        const childId = findId(item.children, targetTo);
        if (childId) return childId;
      }
    }
    return null;
  }

  const activeId = findId(menuItems, to);
  if (activeId) {
    setActiveMenu(activeId);
  }

  // Affiche le loader
  preloader.show();

  // Lance la navigation
  router.push(to).catch(() => {});
}

// ✅ Fonction corrigée : ouverture/fermeture propre des sous-menus
function setActiveMenu(buttonId) {
  const $clicked = $('#' + buttonId).find('a').first();

  // Si c’est un menu principal sans enfants : activer directement
  if (!$clicked.closest('.submenu').length && !$clicked.closest('.submenu-two').length) {
    $('.sidebar li a').removeClass('active');
    $clicked.addClass('active');

    // Fermer tous les sous-menus
    $('.submenu ul, .submenu-two ul').slideUp();
    $('.submenu > a, .submenu-two > a').removeClass('subdrop');
    return;
  }

  // 🔹 Si c’est un sous-menu 2 (niveau enfant d’un sous-menu)
  const $submenuTwo = $clicked.closest('.submenu-two');
  const $submenu = $clicked.closest('.submenu');

  // Cas : clic sur un lien enfant final (pas un <a> parent de sous-menu)
  if ($submenuTwo.length || $submenu.length) {
    $('.sidebar li a').removeClass('active');
    $clicked.addClass('active');

    // Vérifier si le parent est déjà ouvert
    const alreadyOpen = $submenuTwo.children('a').hasClass('subdrop') || $submenu.children('a').hasClass('subdrop');

    // Si déjà ouvert → on ne referme pas à nouveau
    if (!alreadyOpen) {
      // Fermer tous les autres sous-menus
      $('.submenu ul, .submenu-two ul').slideUp();
      $('.submenu > a, .submenu-two > a').removeClass('subdrop');

      // Ouvrir le bon chemin
      if ($submenuTwo.length) {
        $submenuTwo.children('ul').slideDown();
        $submenuTwo.children('a').addClass('subdrop');
        $submenu.children('ul').slideDown();
        $submenu.children('a').addClass('subdrop');
      } else if ($submenu.length) {
        $submenu.children('ul').slideDown();
        $submenu.children('a').addClass('subdrop');
      }
    }
  }
}

// Fonction récursive pour filtrer le menu selon les rôles
function filterMenu(items, userRoles) {
  return items
    .map(item => {
      const newItem = { ...item };

      // Filtrage des enfants
      if (newItem.children) {
        newItem.children = filterMenu(newItem.children, userRoles);
      }

      const hasPermission =
        !newItem.permissions || newItem.permissions.some(p => userRoles.includes(p));
      const hasVisibleChildren = newItem.children && newItem.children.length > 0;

      return hasPermission || hasVisibleChildren ? newItem : null;
    })
    .filter(Boolean);
}

// Computed pour le menu filtré
const filteredMenu = computed(() => {
  if (!auth.user || !auth.user.roles) return [];

  // On récupère un tableau de rôles depuis l'utilisateur
  const roles = Array.isArray(auth.user.roles) ? auth.user.roles : [auth.user.roles];

  return filterMenu(menuItems, roles);
});

function init() {
  // Gestion des clics sur tous les liens du menu
  $('.sidebar-menu').on('click', 'a', function (e) {
    const $link = $(this);
    const $parentLi = $link.parent('li');

    if ($parentLi.hasClass('submenu')) {
      e.preventDefault(); // empêche le lien parent de rediriger
      const $submenu = $link.next('ul');

      // 🔽 Ouvrir / fermer le sous-menu
      if (!$link.hasClass('subdrop')) {
        $parentLi.siblings('li').find('ul:visible').slideUp(250);
        $parentLi.siblings('li').find('a.subdrop').removeClass('subdrop');
        $submenu.slideDown(250);
        $link.addClass('subdrop');
      } else {
        $submenu.slideUp(250);
        $link.removeClass('subdrop');
      }

      // ⚠️ NE PAS fermer la sidebar ici → on veut juste dérouler le menu
      return;
    }

    // ✅ Si c’est un lien normal (pas de sous-menu), on ferme la sidebar
    closeSidebar();
  });

  // Garde les sous-menus actifs ouverts
  $('.sidebar-menu ul li.submenu a.active')
    .parents('ul')
    .prev('a')
    .addClass('subdrop')
    .next('ul')
    .show();
}

// 🔹 Fonction générique pour fermer la sidebar
function closeSidebar() {
  document.querySelector('.main-wrapper')?.classList.remove('slide-nav');
  document.querySelector('.sidebar-overlay')?.classList.remove('opened');
  document.querySelector('html')?.classList.remove('menu-opened');
}

onMounted(() => {
  init();
});

</script>
