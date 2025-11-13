<template>
  <Layout>
    <div class="content pb-0 align-items-center justify-content-center">
      <div class="card rounded-0">
        <div class="card-header text-center">
          <h5 class="mb-0">Page Select2 avec API</h5>
        </div>

        <div class="card-body d-flex flex-column gap-3 align-items-center justify-content-center mb-3">
          <!-- Select2 alimenté par API -->
          <label for="user-select" class="form-label">Sélection des utilisateurs</label>
          <v-select
            v-model="selectedUsers"
            :options="users"
            label="name"
            multiple
            :clearable="true"
            :searchable="true"
            placeholder="Choisir des utilisateurs"
            id="user-select"
          />
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import axios from 'axios'
import { usePreloaderStore } from '@/stores/preloader'
import { useLoadingStore } from '@/stores/loading'
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Layout from '@/layout/applayout.vue'
import { useToastAlert } from '@/function/ToastAlert'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const preloader = usePreloaderStore()
const loadingStore = useLoadingStore()
const { showToast, removeAllToasts } = useToastAlert()

const users = ref([])
const selectedUsers = ref([])
const loadingUsers = ref(false)

async function chargerOptions() {
  loadingUsers.value = true
  try {
    const res = await axios.get('/api/users/list')
    // Exemple : données retournées [{ id: 1, name: 'Alice' }, …]
    users.value = res.data.data || []
    console.log(users.value)
  } catch (err) {
    console.error('Erreur chargement utilisateurs:', err)
    users.value = []
  } finally {
    loadingUsers.value = false
  }
}

onMounted(async () => {
  
  preloader.hide()
  await nextTick()

  // await chargerOptions()

  users.value = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ]
})

</script>

<style scoped>
/* Exemple de style si besoin */
.w-full { width: 100%; }
.md\:w-80 { width: 20rem; }

</style>
