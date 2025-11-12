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
              scrollHeight="450px"
              stripedRows
              showGridlines
            >
            <template #header>
              <div class="row align-items-center justify-content-between mb-2">
                <!-- Colonne gauche : recherche -->
                <div class="col-md-6 text-start">
                  <div class="datatable-filter d-flex align-items-center">
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      v-model="globalFilter"
                      class="form-control form-control-sm"
                      @input="filters.global.value = globalFilter"
                    />
                  </div>
                </div>

                <!-- Colonne droite : bouton Export CSV -->
                <div class="col-md-6 text-end">
                  <div class="dt-export-buttons d-flex align-items-center mb-2 mb-sm-0">
                    <button class="btn btn-sm btn-outline-danger" @click="handleExportPDF">
                      <i class="pi pi-file-pdf me-1"></i> PDF
                    </button>
                  </div>
                </div>
              </div>
            </template>
              <Column field="id" header="N°" style="width:5%"></Column>
              <Column field="name" header="Nom" style="width:25%"></Column>
              <Column field="email" header="Email" style="width:30%"></Column>
              <Column field="login" header="Login" style="width:15%"></Column>
              <Column header="Statut" style="width:10%">
                <template #body="slotProps">
                  {{ slotProps.data.status || 'N/A' }}
                </template>
              </Column>
              <Column header="Actions" style="width:15%">
                <template #body="slotProps">
                  <button class="btn btn-sm btn-info me-1" @click="editUser(slotProps.data)">Mise à jour</button>
                  <button class="btn btn-sm btn-warning" @click="openModal(slotProps.data)">Détails</button>
                </template>
              </Column>
            </DataTable>
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
import { ref, onMounted, nextTick, reactive } from 'vue'
import Layout from '@/layout/applayout.vue'
import axios from 'axios'
import { pdfListeUser } from '@/data/pdf/pdf_liste_user.js'
import { showPreloader } from '@/function/showPreloader';

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const donnees = ref([])
const loading = ref(false)
const showModal = ref(false)
const userSelected = ref({})
const rowsPerPage = ref(10)
const globalFilter = ref('')
const dt = ref(null)
const searchTerm = ref('')

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

const exportCSV = () => {
  dt.value.exportCSV()
}

// 🔁 Récupérer les données visibles / filtrées
const getDonneesFiltrees = () => {
  if (!dt.value) return []

  // DataTable de PrimeVue possède une propriété `filteredValue` si filtré
  const filtered = dt.value.filteredValue || dt.value.value || []
  return filtered.filter(u =>
    u.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    u.login.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
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
  await nextTick()
  fetchUsers()
})
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
</style>
