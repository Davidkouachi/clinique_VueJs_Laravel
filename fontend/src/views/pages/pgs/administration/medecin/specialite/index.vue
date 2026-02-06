<template>
    <TitrePage />

    <Card class="h-full" >
        <template #header>
            <!-- <div class="flex justify-center items-center mt-5">
                <h3 class="font-semibold text-center">
                    Utilisateurs
                </h3>
            </div> -->
        </template>
        <template #content>
            <DataTable
                ref="dt"
                :value="lists"
                :rows="rowsPerPage"
                :paginator="true"
                @page="onPage"
                dataKey="id"
                :rowHover="true"
                v-model:selection="selectedLists"
                v-model:filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['nom']"
                scrollable
                scrollHeight="auto"
                :rowClass="rowClass"
                >
                <div class="flex justify-center my-4">
                    <Chip 
                        label="Seules les données actuellement visibles dans le tableau seront exportées. Les filtres appliqués sont automatiquement pris en compte." 
                        icon="pi pi-info-circle" 
                        removable 
                    />
                </div>

                <template #header>
                    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <FloatLabel variant="in" class="flex-1">
                            <InputText 
                                id="in_label" 
                                v-if="filters.global" 
                                v-model="filters.global.value" 
                                autocomplete="off" 
                            />
                            <label for="in_label">Recherche...</label>
                        </FloatLabel>
                        <div class="flex flex-wrap gap-2 mt-2 md:mt-0">
                            <Button 
                                type="button" 
                                icon="pi pi-filter-slash" 
                                label="Filtre" 
                                @click="initFilters" 
                                severity="info"
                            />
                            <Button 
                                type="button" 
                                icon="pi pi-plus" 
                                label="Ajouter" 
                                @click="insertTable()" 
                                severity="success"
                            />
                            <Button 
                                type="button" 
                                icon="pi pi-refresh" 
                                @click="fetchLists(true)" 
                                severity="warn" 
                                :disabled="loadingBtn" 
                                :loading="loadingBtn" 
                                :label="loadingBtn ? 'en cours...' : 'Actualiser'"
                            />
                        </div>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center text-red-600 py-4">
                        <i class="pi pi-info-circle fs-2"></i>
                        <p>Aucune donnée disponible</p>
                    </div>
                </template>

                <Column field="id" header="N°" style="width:5%">
                    <template #body="{ index }">
                        <Skeleton v-if="loading" width="2rem" height="1rem"/>
                        <span v-else>{{ (currentPage - 1) * rowsPerPage + index + 1 }}</span>
                    </template>
                </Column>

                <Column field="nom" header="Nom" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="8rem" height="1rem"/>
                        <span v-else>{{ data?.nom ?? '-' }}</span>
                    </template>
                </Column>

                <Column field="statut" header="Statut" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="8rem" height="1rem"/>
                        <span
                            v-else
                            :class="actionClass(data?.statut)"
                            class="font-bold px-2 py-1 rounded text-sm"
                        >
                          {{ data?.statut === 1 ? 'Activé' : 'Désactivé' }}
                        </span>
                    </template>
                </Column>

                <Column field="created_at" header="Date de création" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="12rem" height="1rem"/>
                        <span v-else>{{ formaDateHeure(data.created_at) }}</span>
                    </template>
                </Column>

                <Column header="Actions" style="width:10%">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="6rem" height="2rem" />
                        <div class="flex flex-row gap-2" v-else >
                            <Button
                                severity="info" 
                                type="button" 
                                icon="pi pi-pencil" 
                                label="" 
                                @click="updateTable(data)"
                                v-if="data.statut === 1"
                            />
                            <Button
                                severity="danger" 
                                type="button" 
                                icon="pi pi-lock" 
                                label="" 
                                @click="confirmStatut($event, data.id, 0)"
                                v-if="data.statut === 1"
                            />
                            <Button
                                severity="success" 
                                type="button" 
                                icon="pi pi-unlock" 
                                label="" 
                                @click="confirmStatut($event, data.id, 1)"
                                v-if="data.statut === 0"
                            />
                        </div>
                    </template>
                </Column>

                <template #footer>
                    <div class="flex justify-between items-center p-3">
                        <span>{{ totalRows.toLocaleString() }} lignes trouvées</span>

                        <span>{{ currentPage }} sur {{ totalPages.toLocaleString() }} Page(s)</span>
                    </div>
                </template>
            </DataTable>
        </template>
    </Card>

    <Drawer 
        v-model:visible="showEditModal" 
        :header="editMode ? 'Mise à jour' : 'Nouvelle Spécialité'" 
        position="full">
        <Fluid>
            <div class="flex">
                <form @submit.prevent="formSubmit" class="flex flex-col gap-4 w-full">
                    <div class="grid grid-cols-1 gap-4 mt-4">
                        <FloatLabel variant="on">
                            <InputText id="name" type="text" v-model="name" autocomplete="off" size="large"/>
                            <label for="name">Nom</label>
                        </FloatLabel>
                    </div>
                    <div class="flex items-center gap-2 mt-4">
                        <Checkbox v-model="checked" binary />
                        <span>Je confirme les informations</span>
                    </div>
                    <div class="flex flex-wrap gap-2 mt-4">
                        <div class="col-6">
                            <Button 
                                label="Annuler" 
                                severity="secondary" 
                                @click="showEditModal = false"
                                size="large"
                                class="w-full"
                                :fluid="false" 
                            />
                        </div>
                        <div class="col-6">
                            <Button
                                type="submit"
                                icon="pi pi-check"
                                severity="success"
                                :loading="loadingForm"
                                :label="loadingForm ? 'Opération en cours...' : editMode ? 'Mettre à jour' : 'Enregistrer'"
                                size="large"
                                class="w-full"
                                :fluid="false"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </Fluid>
    </Drawer>

</template>

<script setup>
import { ref, onMounted, onUnmounted, computed,nextTick, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import TitrePage from '@/layout/elements/TitrePage.vue';

import { useScript } from './script'

const actionClass = (action) => {
    switch (action) {
        case 1:
            return 'bg-green-500 text-white'
        case 0:
            return 'bg-red-500 text-white'
        default:
            return 'bg-gray-500 text-white'
    }
}

const {
        auth,

        actionItems,

        // ------------------ STATE (tableau & filtres)
        lists,
        loading,
        loadingBtn,
        filters,
        globalFilter,
        dt,
        menuRefs,

        // ------------------ Pagination
        rowsPerPage,
        currentPage,
        totalRows,
        totalPages,

        // ------------------ Sélection
        selectedLists,
        isSelected,
        isAllSelected,

        // ------------------ Formulaire édition
        editMode,
        editId,
        checked,
        loadingForm,

        // ------------------ Méthodes API
        fetchLists,

        // ------------------ Filtres & table
        initFilters,
        onPage,
        rowClass,
        toggleRow,
        toggleAll,
        showSelected,
        selectableRows,

        // ------------------ Actions UI
        insertTable,
        updateTable,
        confirmStatut,

        // ------------------ Modal
        showEditModal,

        // ------------------ Submit
        formSubmit,

        // ------------------ Formulaire champ
        name,

        // ------------------ Utils
        formaDateHeure
} = useScript();

onMounted( () => {
    fetchLists();
});

</script>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) { font-weight: bold; }
:deep(.p-datatable-scrollable .p-frozen-column) { font-weight: bold; }
:deep(.row-connect-user) {
    background-color: #ccfbf1 !important;
}
:deep(.row-deconnect-user) {
    background-color: #fee2e2 !important;
}
</style>
