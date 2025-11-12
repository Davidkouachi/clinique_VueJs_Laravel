<template>
  <Layout>
    <div class="content pb-0 mb-3">
      <div class="d-flex align-items-center justify-content-between gap-2 pb-3 mb-0">
        <h4 class="fw-bold mb-0">Patients List</h4>
        <button
          class="btn btn-warning fs-13 btn-md"
          :disabled="loading"
          @click="fetchUsers"
        >
          <i class="ti ti-refresh me-1"></i> Actualiser
        </button>
      </div>

      <div class="card rounded-0">
        <div class="card-body">
          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 mb-0">Chargement des données...</p>
          </div>
          <div v-else>
            <div class="card-modern rounded-3 shadow-sm">
                <!-- === DataTable === -->
                <DataTable
                  :value="donnees"
                  :paginator="true"
                  :rows="rowsPerPage"
                  :rowsPerPageOptions="[5,10,20,50]"
                  :exportFilename="'patients_export'"
                  :filters="filters"
                  :globalFilterFields="['name','email','login']"
                  ref="dt"
                  scrollable
                  scrollHeight="auto"
                  
                  showGridlines
                  class="datatable-striped-hover"
                >
                  <!-- 🔹 En-tête du tableau -->
                  <template #header>
                    <div class="datatable-header d-flex flex-column flex-md-row align-items-md-center justify-content-between">
                      
                      <div class="datatable-filter mb-2 mb-md-0">
                        <input
                          type="text"
                          placeholder="Rechercher..."
                          v-model="globalFilter"
                          class="form-control form-control-sm datatable-search"
                          @input="filters.global.value = globalFilter"
                        />
                      </div>

                      <div class="dt-export-buttons">
                        <button class="btn btn-sm btn-outline-danger d-flex align-items-center export-btn" @click="handleExportPDF">
                          <i class="pi pi-file-pdf me-1"></i> PDF
                        </button>
                      </div>
                    </div>
                  </template>

                  <!-- 🔹 Colonnes -->
                  <Column field="id" header="N°" style="width:5%" headerClass="table-header"></Column>

                  <Column field="name" header="Nom" style="width:25%" headerClass="table-header">
                    <template #body="slotProps">
                      <div class="d-flex align-items-center">
                        <span class="avatar bg-primary rounded-circle me-2">
                          <i class="ti ti-user fs-20 text-white"></i>
                        </span>
                        <div>
                          <span class="fw-semibold text-dark">{{ slotProps.data.name }}</span>
                          <div class="text-muted small">{{ slotProps.data.email }}</div>
                        </div>
                      </div>
                    </template>
                  </Column>

                  <Column field="email" header="Email" style="width:30%" headerClass="table-header"></Column>
                  <Column field="login" header="Login" style="width:15%" headerClass="table-header"></Column>

                  <Column header="Statut" style="width:10%" headerClass="table-header">
                    <template #body="slotProps">
                      <span class="badge bg-success text-white text-success fw-medium px-2 py-1 rounded-1">
                        {{ slotProps.data.status || 'Disponible' }}
                      </span>
                    </template>
                  </Column>

                  <Column header="" style="width:5%" headerClass="table-header text-center">
                    <template #body="slotProps">
                      <div class="text-center">
                        <!-- Menu PrimeVue -->
                        <Menu 
                          :ref="el => menuRefs[slotProps.data.id] = el" 
                          :popup="true" 
                          appendTo="body"
                          :model="[
                            {
                              label: 'Mise à jour',
                              icon: 'ti ti-edit text-info fs-20 me-2',
                              command: () => editUser(slotProps.data)
                            },
                            {
                              label: 'Détails',
                              icon: 'ti ti-eye text-warning fs-20 me-2',
                              command: () => openModal(slotProps.data)
                            }
                          ]"
                        />

                        <!-- Bouton d’ouverture -->
                        <a
                          href="javascript:void(0);"
                          class="action-icon shadow-sm fs-14 border rounded-2 p-1"
                          @click="toggleMenu(slotProps.data.id, $event)"
                        >
                          <i class="ti ti-dots-vertical"></i>
                        </a>
                      </div>
                    </template>
                  </Column>

                </DataTable>

            </div>
          </div>
        </div>
      </div>

      <!-- Modal détails -->
      <div v-if="showModal">
        <div class="modal fade show d-block" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header bg-warning">
                <h5 class="modal-title text-white">Détails de l'utilisateur</h5>
                <button type="button" class="btn-close text-white" @click="closeModal"></button>
              </div>
              <div class="modal-body">
                <ul class="list-group">
                  <li class="list-group-item"><strong>Nom :</strong> {{ userSelected.name || 'N/A' }}</li>
                  <li class="list-group-item"><strong>Email :</strong> {{ userSelected.email || 'N/A' }}</li>
                  <li class="list-group-item"><strong>Login :</strong> {{ userSelected.login || 'N/A' }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show"></div>
      </div>

    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, reactive } from 'vue'
import Layout from '@/layout/applayout.vue'
import axios from 'axios'
import { pdfListeUser } from '@/data/pdf/pdf_liste_user.js'
import { showPreloader } from '@/function/showPreloader';
import { usePreloaderStore } from '@/stores/preloader'
import { useToastAlert } from '@/function/ToastAlert'
import { useAuthStore } from '@/stores/auth'

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Menu from 'primevue/menu';

const auth = useAuthStore()
const preloader = usePreloaderStore()
const { showToast } = useToastAlert()
const donnees = ref([])
const loading = ref(false)
const showModal = ref(false)
const userSelected = ref({})
const rowsPerPage = ref(10)
const globalFilter = ref('')
const dt = ref(null)
const searchTerm = ref('')
const menuRefs = ref({}) // stocke chaque menu par ID

const toggleMenu = (id, event) => {
  // Fermer tous les menus ouverts
  Object.values(menuRefs.value).forEach(menu => {
    if (menu && menu !== menuRefs.value[id]) menu.hide()
  })

  // Ouvrir le menu de la ligne cliquée
  menuRefs.value[id]?.toggle(event)
}


// Pour activer la recherche globale
const filters = reactive({
  global: { value: null, matchMode: 'contains' } // mode "contains" pour rechercher dans n'importe quelle sous-chaîne
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/users/list')
    donnees.value = res.data?.data || []
  } catch (err) {
    console.error('Erreur lors du chargement:', err)
    donnees.value = []
  } finally {
    loading.value = false
    await nextTick()
  }
}

const openModal = (user) => {
  Object.values(menuRefs.value).forEach(menu => menu.hide())
  document.activeElement?.blur()

  userSelected.value = user
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  userSelected.value = {}
}

const editUser = (user) => {
  console.log('Modifier l’utilisateur :', user)
}

// 🔁 Récupérer les données visibles / filtrées
const getDonneesFiltrees = () => {
  if (!dt.value) return []

  // Utiliser filteredValue si disponible, sinon toute la table
  const data = dt.value.filteredValue ?? dt.value.value ?? []

  // Si tu veux filtrer encore plus avec searchTerm, tu peux le faire
  if (globalFilter.value?.trim()) {
    const term = globalFilter.value.toLowerCase()
    return data.filter(u =>
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.login.toLowerCase().includes(term)
    )
  }

  return data
}

const handleExportPDF = () => {
  const donneesRecherchees = getDonneesFiltrees()

  if (!donneesRecherchees.length) {
    showToast('warn', 'Alerte', 'Aucune donnée à exporter.')
    return
  }

  showPreloader('Chargement du fichier PDF...', () => {
    pdfListeUser(donneesRecherchees)
  }, 2000)
}

onMounted(async () => {

  preloader.hide()
  await nextTick()

  await fetchUsers()
})
</script>



