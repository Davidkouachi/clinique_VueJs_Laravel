<template>
    <TitrePage />

    <Card class="h-full" >
        <template #header>
            <!-- <div class="flex justify-center items-center mt-5">
                <h3 class="font-semibold text-center">
                    Rôles
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
                :globalFilterFields="Object.keys(lists[0] || {})"
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
                            <!-- <Button type="button" icon="pi pi-filter-slash" label="Filtre" @click="initFilters" severity="primary"/> -->
                            <Button type="button" icon="pi pi-refresh" @click="fetchLists(true)" severity="warn" :disabled="loadingBtn" :loading="loadingBtn" :label="loadingBtn ? 'en cours...' : 'Actualiser'"/>
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

                <Column field="code" header="Code" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="12rem" height="1rem"/>
                        <span v-else>{{ data?.code ?? '-' }}</span>
                    </template>
                </Column>

                <Column field="nom" header="Nom complet" style="min-width: 12rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="10rem" height="1rem"/>
                        <span v-else>
                            {{ data.signe }}.
                            {{ data.nom?.toUpperCase() }}
                            {{ data.prenom
                                ? data.prenom.charAt(0).toUpperCase() + data.prenom.slice(1).toLowerCase()
                                : '' }}
                        </span>
                    </template>
                </Column>

                <Column field="email" header="Email" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="12rem" height="1rem"/>
                        <span v-else>{{ data?.email ?? '-' }}</span>
                    </template>
                </Column>

                <Column field="numero_ordre" header="Numéro d'ordre" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="12rem" height="1rem"/>
                        <span v-else>{{ data?.numero_ordre ?? '-' }}</span>
                    </template>
                </Column>

                <Column field="specialite" header="Spécialité" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="12rem" height="1rem"/>
                        <span v-else>{{ data?.specialite ?? '-' }}</span>
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
                          {{ data?.statut_label ?? '-' }}
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
                                severity="warn" 
                                type="button" 
                                icon="pi pi-eye" 
                                label=""
                                @click="viewTable(data)"
                            />
                            <Button
                                severity="info" 
                                type="button" 
                                icon="pi pi-pencil" 
                                label="" 
                                @click="updateTable(data)"
                            />
                            <Button
                                type="button" 
                                :severity="data.statut === 1 ? 'danger' : 'success'"
                                :icon="data.statut === 1 ? 'pi pi-lock' : 'pi pi-unlock'"
                                label=""
                                @click="changeStatut(data.uid, data.statut === 1 ? 0 : 1)"
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
        header="Mise à jour" 
        position="full">
        <Fluid>
            <form @submit.prevent="formSubmit(null)" class="flex flex-col gap-4 w-full mt-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <!-- Nom -->
                    <FloatLabel variant="on">
                        <InputText id="nom" v-model="nom" size="large" class="w-full" variant="filled" :invalid="submitted && !nom"/>
                        <label for="nom">Nom</label>
                    </FloatLabel>

                    <!-- Prénom -->
                    <FloatLabel variant="on">
                        <InputText id="prenom" v-model="prenom" size="large" class="w-full" :invalid="submitted && !prenom" variant="filled"/>
                        <label for="prenom">Prénom</label>
                    </FloatLabel>

                    <!-- Email -->
                    <FloatLabel variant="on">
                        <InputText id="email" type="email" v-model="email" size="large" class="w-full" :invalid="submitted && !email" variant="filled"/>
                        <label for="email">Email</label>
                    </FloatLabel>

                    <!-- Téléphone -->
                    <FloatLabel variant="on">
                        <InputMask id="telephone" v-model="telephone" size="large" class="w-full" mask="9999999999" inputmode="numeric" pattern="[0-9]*" :invalid="submitted && !telephone" variant="filled"/>
                        <label for="telephone">Téléphone</label>
                    </FloatLabel>

                    <!-- Titre (DR / Professeur) -->
                    <div class="flex gap-2 w-full">
                        <FloatLabel variant="on" class="flex-1">
                            <Select
                                v-model="titre_id"
                                :options="titresOptions"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                size="large"
                                filter
                                :loading="loadingSelectTitre"
                                emptyMessage="Aucune donnée disponible"
                                emptyFilterMessage="Aucun résultat trouvé"
                                :invalid="submitted && !titre_id"
                                variant="filled"
                            />
                            <label>Titre</label>
                        </FloatLabel>
                        <Button
                            icon="pi pi-refresh"
                            size="large"
                            severity="secondary"
                            :loading="loadingSelectTitreRefresh"
                            :disabled="loadingSelectTitreRefresh" 
                            @click="fetchTitre(true)"
                            variant="filled"
                        />
                    </div>

                    <!-- Spécialité -->
                    <div class="flex gap-2 w-full">
                        <FloatLabel variant="on" class="flex-1">
                            <Select
                                v-model="specialite_id"
                                id="specialite_id"
                                :options="specialiteOptions"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                size="large"
                                filter
                                :loading="loadingSelectSpecialite"
                                emptyMessage="Aucune donnée disponible"
                                emptyFilterMessage="Aucun résultat trouvé"
                                :invalid="submitted && !specialite_id"
                                variant="filled"
                            />
                            <label for="specialite_id">Spécialité</label>
                        </FloatLabel>
                        <Button
                            icon="pi pi-refresh"
                            size="large"
                            severity="secondary"
                            :loading="loadingSelectSpecialiteRefresh"
                            :disabled="loadingSelectSpecialiteRefresh" 
                            @click="fetchSpecialite(true)"
                            variant="filled"
                        />
                    </div>

                    <!-- Numéro d’ordre -->
                    <FloatLabel variant="on">
                        <InputText id="numero_ordre" v-model="numero_ordre" size="large" class="w-full" variant="filled"/>
                        <label for="numero_ordre">Numéro d’ordre</label>
                    </FloatLabel>

                    <FloatLabel variant="on">
                        <Select
                            v-model="ajouterAcces"
                            :options="accesOptions"
                            optionLabel="label"
                            optionValue="value"
                            class="w-full"
                            size="large"
                            placeholder=""
                            variant="filled"
                        />
                        <label>Ajouter / Modifier accès ?</label>
                    </FloatLabel>

                    <template v-if="ajouterAcces" >
                        <!-- Login -->
                        <FloatLabel variant="on" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000' }">
                            <InputText
                                v-model="login"
                                size="large"
                                class="w-full"
                                :invalid="submitted && ajouterAcces && !login"
                                variant="filled"
                            />
                            <label>Login</label>
                        </FloatLabel>

                        <!-- Mot de passe -->
                        <FloatLabel variant="on" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000' }">
                            <Password id="password" v-model="password" :toggleMask="true" class="" fluid :feedback="true" weakLabel="Petit" mediumLabel="Moyen" strongLabel="Bien" promptLabel="Entrez votre mot de passe" size="large" autocomplete="off"
                            variant="filled"
                                :invalid="
                                    submitted &&
                                    ajouterAcces &&
                                    (
                                        !password ||
                                        (cpassword && password !== cpassword)
                                    )
                                "
                            >
                                <template #header>
                                    <div class="font-semibold text-xm mb-4">Conditions</div>
                                </template>
                                <template #footer>
                                    <Divider />
                                    <ul class="pl-2 my-0 leading-normal text-sm">
                                        <li>✔ 1 minuscule</li>
                                        <li>✔ 1 majuscule</li>
                                        <li>✔ 1 chiffre</li>
                                        <li>✔ 8 caractères minimum</li>
                                    </ul>
                                </template>
                            </Password>
                            <label for="password">Mot de passe</label>
                        </FloatLabel>

                        <FloatLabel variant="on" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000' }">
                            <Password id="cpassword" v-model="cpassword" :toggleMask="true" class="" fluid :feedback="true" weakLabel="Petit" mediumLabel="Moyen" strongLabel="Bien" promptLabel="Confirmer le mot de passe" size="large" autocomplete="off"
                            variant="filled"
                                :invalid="
                                    submitted &&
                                    ajouterAcces &&
                                    (
                                        !cpassword ||
                                        password !== cpassword
                                    )
                                "
                            >
                                <template #header>
                                    <div class="font-semibold text-xm mb-4">Conditions</div>
                                </template>
                                <template #footer>
                                    <Divider />
                                    <ul class="pl-2 my-0 leading-normal text-sm">
                                        <li>✔ 1 minuscule</li>
                                        <li>✔ 1 majuscule</li>
                                        <li>✔ 1 chiffre</li>
                                        <li>✔ 8 caractères minimum</li>
                                    </ul>
                                </template>
                            </Password>
                            <label for="cpassword">Confirmer le Mot de passe</label>
                        </FloatLabel>
                    </template>

                </div>

                <div class="flex items-center gap-2 mt-4">
                    <Checkbox v-model="checked" binary />
                    <span>Je confirme les informations</span>
                </div>
                <div class="flex flex-wrap gap-2 mt-4">
                    <div class="col-6">
                        <Button
                            type="submit"
                            icon="pi pi-check"
                            severity="success"
                            :loading="loadingForm"
                            :label="loadingForm ? 'Opération en cours...' : 'Mise à jour'"
                            size="large"
                            class="w-full"
                            :fluid="false"
                        />
                    </div>
                </div>
            </form>
        </Fluid>
    </Drawer>

</template>

<script setup>
import { ref, onMounted, computed,nextTick, watch } from 'vue';
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
        listSelected,

        // ------------------ Formulaire édition

        // ------------------ Méthodes API
        fetchLists,
        deletList,

        // ------------------ Filtres & table
        initFilters,
        onPage,
        rowClass,
        toggleRow,
        toggleAll,
        showSelected,
        selectableRows,

        // ------------------ Actions UI
        updateTable,
        deleteTable,
        viewTable,

        // ------------------ Submit
        changeStatut,

        // ------------------ Utils
        formaDateHeure,

        // ------------------------- format
        onlyUppercase,
        onlyNumbers,
} = useScript();

onMounted(() => {
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