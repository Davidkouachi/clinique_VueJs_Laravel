<template>
    <TitrePage />

<div class="card flex flex-col gap-6 justify-center mb-0">
    <div class="text-center mt-4 mb-4 text-2xl font-bold">
        FORMULAIRE
    </div>

    <Stepper value="1" v-model:value="currentStep" class="basis-full">
        
        <StepList >
            <Step v-for="(step, index) in steps" :key="step.value" v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="step.value">
                <!-- si c'est le dernier step -->
                <div :class="index === steps.length - 1 ? 'm-3 flex flex-row pl-2' : 'm-3 flex flex-row flex-auto gap-2'" v-bind="a11yAttrs.root">
                    <button class="bg-transparent border-0 inline-flex flex-col gap-2" @click="activateCallback" v-bind="a11yAttrs.header" :disabled="!isStepValid(step.value - 1)">
                        <span :class="[
                        'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                        { 'bg-primary text-primary-contrast border-primary': value <= currentStep, 'border-surface-200 dark:border-surface-700': value > currentStep }
                      ]">
                            <i :class="step.icon" />
                        </span>
                    </button>
                    <!-- ajouter un divider sauf pour le dernier -->
                    <Divider v-if="index !== steps.length - 1" />
                </div>
            </Step>
        </StepList>

        <StepPanels>

            <!-- STEP 1 -->
            <StepPanel v-slot="{ activateCallback }" value="1">
                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 p-3 mt-4 flex flex-col gap-3">
                    <div class="text-center mt-4 mb-4 text-xl font-bold uppercase">
                        {{ currentStepLabel }}
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-3">

                        <FloatLabel variant="on">
                            <InputText id="nom" v-model="form.nom" class="w-full" variant="" @input="form.nom = form.nom.toUpperCase()" size="large" />
                            <label for="nom">Nom *</label>
                        </FloatLabel>

                        <FloatLabel variant="on">
                            <InputText id="prenoms" v-model="form.prenoms" class="w-full" variant="" size="large" @input="form.prenoms = form.prenoms.toUpperCase()"/>
                            <label for="prenoms">Prénoms *</label>
                        </FloatLabel>

                        <FloatLabel variant="on">
                            <Select
                                appendTo="self"
                                v-model="form.sexe"
                                :options="sexes"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                variant=""
                                size="large"
                            />
                            <label>Sexe *</label>
                        </FloatLabel>

                        <FloatLabel variant="on">
                            <DatePicker
                                v-model="form.datenais"
                                class="w-full"
                                dateFormat="dd/mm/yy"
                                :maxDate="new Date()"
                                size="large"
                            />
                            <label>Date de naissance *</label>
                        </FloatLabel>

                        <FloatLabel variant="on">
                            <InputText v-model="form.lieunais" class="w-full" variant="" size="large"/>
                            <label>Lieu de naissance</label>
                        </FloatLabel>
                    </div>
                    <small class="text-red-500">{{ errors.step1 }}</small>
                    <div class="flex pt-6 justify-end">
                        <Button
                            :disabled="!isStepValid('1')"
                            label="Suivant"
                            severity="success"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            @click="goToStep('2', activateCallback)" 
                        />
                    </div>
                </div>
            </StepPanel>

            <!-- STEP 2 -->
            <StepPanel v-slot="{ activateCallback }" value="2">
                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 p-3 mt-4 flex flex-col gap-3">
                    <div class="text-center mt-4 mb-4 text-xl font-bold uppercase">
                        {{ currentStepLabel }}
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-3">

                        <FloatLabel variant="on">
                            <InputText v-model="form.telephone1" class="w-full" variant="" size="large"/>
                            <label>Téléphone *</label>
                        </FloatLabel>

                        <FloatLabel variant="on">
                            <InputText v-model="form.telephone2" class="w-full" variant="" size="large"/>
                            <label>Téléphone secondaire</label>
                        </FloatLabel>

                        <FloatLabel variant="on">
                            <InputText v-model="form.email" class="w-full" variant="" size="large"/>
                            <label>Email</label>
                        </FloatLabel>

                        <FloatLabel variant="on">
                            <InputText v-model="form.adresse" class="w-full" variant="" size="large"/>
                            <label>Adresse *</label>
                        </FloatLabel>
                    </div>
                    <small class="text-red-500">{{ errors.step2 }}</small>
                    <div class="flex pt-6 justify-between">
                        <Button 
                            label="Retour" 
                            severity="danger"
                            icon="pi pi-arrow-left"
                            iconPos="left"
                            @click="activateCallback('1')" 
                        />
                        <Button
                            :disabled="!isStepValid('2')"
                            label="Suivant"
                            severity="success"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            @click="goToStep('3', activateCallback)"
                        />
                    </div>
                </div>
            </StepPanel>

            <!-- STEP 3 -->
            <StepPanel v-slot="{ activateCallback }" value="3">
                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 p-3 mt-4 flex flex-col gap-3">
                    <div class="text-center mt-4 mb-4 text-xl font-bold uppercase">
                        {{ currentStepLabel }}
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-3">

                        <FloatLabel variant="on">
                            <Select
                                appendTo="self"
                                v-model="isAssure"
                                :options="optionAssure"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                variant=""
                                size="large"
                            />
                            <label>Vous êtes assuré *</label>
                        </FloatLabel>

                        <template v-if="isAssure === 1" >

                            <FloatLabel variant="on" class="flex-1">
                                <Select
                                    ref="assuranceSelectRef"
                                    filter
                                    v-model="form.assurance_id"
                                    :options="assurances || []"
                                    optionLabel="label"
                                    optionValue="value"
                                    class="w-full"
                                    appendTo="self"
                                    :loading="loadingSelectAssurance"
                                    emptyMessage="Aucune donnée disponible"
                                    emptyFilterMessage="Aucun résultat trouvé"
                                    size="large">
                                    <template #header>
                                        <div class="font-medium px-3 py-2">
                                            Veuillez sélectionner votre assurance
                                        </div>
                                    </template>
                                    <template #option="slotProps">
                                        <div class="flex items-center">
                                            <div>
                                                {{ slotProps.option.label }}
                                            </div>
                                        </div>
                                    </template>
                                    <template #footer>
                                        <div class="p-3 flex justify-between">
                                            <Button label="Actualiser" severity="warn" variant="" size="small" icon="pi pi-refresh" :loading="loadingSelectAssuranceRefresh"
                                            :disabled="loadingSelectAssuranceRefresh" 
                                            @click="fetchAssurances(true)" />
                                        </div>
                                    </template>
                                </Select>
                                <label>Assurance</label>
                            </FloatLabel>

                            <FloatLabel variant="on">
                                <InputText v-model="form.numero_assure" class="w-full" variant="" size="large"/>
                                <label>Numéro assuré</label>
                            </FloatLabel>

                            <FloatLabel variant="on">
                                <InputText v-model="form.taux" class="w-full" variant="" size="large"/>
                                <label>Taux (%)</label>
                            </FloatLabel>

                        </template>
                    </div>
                    <small class="text-red-500">{{ errors.step3 }}</small>
                    <div class="flex pt-6 justify-between">
                        <Button 
                            label="Retour" 
                            severity="danger"
                            icon="pi pi-arrow-left"
                            iconPos="left"
                            @click="activateCallback('2')" 
                        />
                        <Button
                            :disabled="!isStepValid('3')"
                            label="Suivant"
                            severity="success"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            @click="goToStep('4', activateCallback)"
                        />
                    </div>
                </div>
            </StepPanel>

            <!-- STEP 4 -->
            <StepPanel v-slot="{ activateCallback }" value="4">
                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 p-3 mt-4 flex flex-col gap-3">
                    <div class="text-center mt-4 mb-4 text-xl font-bold uppercase">
                        {{ currentStepLabel }}
                    </div>
                    <div class="flex flex-col gap-4">

                        <Fieldset
                            v-for="(urgence, index) in urgences"
                            :key="index"
                            :legend="'Contact d\'urgence #' + (index + 1)">

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-3">

                                <FloatLabel variant="on">
                                    <InputText v-model="urgence.nom" class="w-full" variant="filled" size="large"/>
                                    <label>Nom</label>
                                </FloatLabel>

                                <FloatLabel variant="on">
                                    <InputText v-model="urgence.lien" class="w-full" variant="filled" size="large"/>
                                    <label>Lien</label>
                                </FloatLabel>

                                <FloatLabel variant="on">
                                    <InputText v-model="urgence.telephone1" class="w-full" variant="filled" size="large"/>
                                    <label>Téléphone *</label>
                                </FloatLabel>

                                <FloatLabel variant="on">
                                    <InputText v-model="urgence.telephone2" class="w-full" variant="filled" size="large"/>
                                    <label>Téléphone secondaire</label>
                                </FloatLabel>

                            </div>

                            <!-- 🔥 ACTIONS -->
                            <div class="flex justify-between mt-4">

                                <!-- 🗑 Supprimer sur TOUS -->
                                <Button
                                    label="Supprimer"
                                    icon="pi pi-trash"
                                    severity="danger"
                                    :disabled="urgences.length === 1"
                                    @click="removeUrgence(index)"
                                />

                                <!-- ➕ Ajouter UNIQUEMENT sur le dernier -->
                                <Button
                                    v-if="index === urgences.length - 1"
                                    label="Ajouter"
                                    icon="pi pi-plus"
                                    severity="success"
                                    @click="addUrgence"
                                />

                            </div>

                        </Fieldset>
                    </div>
                    <small class="text-red-500">{{ errors.step4 }}</small>
                    <div class="flex pt-6 justify-between">
                        <Button 
                            label="Retour" 
                            severity="danger"
                            icon="pi pi-arrow-left"
                            iconPos="left"
                            @click="activateCallback('3')" 
                        />
                        <Button
                            :disabled="!isStepValid('4')"
                            label="Suivant"
                            severity="success"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            @click="goToStep('5', activateCallback)"
                        />
                    </div>
                </div>
            </StepPanel>

            <!-- STEP 5 -->
            <StepPanel v-slot="{ activateCallback }" value="5">
                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 p-3 mt-4 flex flex-col gap-3">
                    <div class="text-center mt-4 mb-4 text-xl font-bold uppercase">
                        {{ currentStepLabel }}
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-3">

                        <FloatLabel variant="on" class="">
                            <MultiSelect
                                ref="antecedentSelectRef"
                                v-model="form.antecedents"
                                :options="antecedentsOption || []" 
                                optionLabel="label"
                                optionValue="value"
                                :loading="loadingSelectAntecedent"
                                filter 
                                placeholder="" 
                                display="chip"
                                :maxSelectedLabels="2"
                                selectedItemsLabel="{0} éléments sélectionnés" 
                                class="w-full" 
                                size="large" 
                                emptyMessage="Aucune donnée disponible"
                                emptyFilterMessage="Aucun résultat trouvé">
                                <template #header>
                                    <div class="font-medium px-3 py-2">
                                        Vous pouvez sélectionner plusieurs
                                    </div>
                                </template>
                                <template #option="slotProps">
                                    <div class="flex items-center">
                                        <div>
                                            {{ slotProps.option.label }}
                                        </div>
                                    </div>
                                </template>
                                <!-- icon dans la zone de placeholder -->
                                <!-- <template #dropdownicon>
                                    <i class="pi pi-map" />
                                </template> -->
                                <!-- icon dans la zone de recherche -->
                                <!-- <template #filtericon>
                                    <i class="pi pi-map-marker" />
                                </template> -->
                                <template #footer>
                                    <div class="p-3 flex justify-between">
                                        <Button label="Ajouter" severity="success" variant="" size="small" icon="pi pi-plus" />
                                        <Button label="Actualiser" severity="warn" variant="" size="small" icon="pi pi-refresh" :loading="loadingSelectAntecedentRefresh"
                                        :disabled="loadingSelectAntecedentRefresh" 
                                        @click="fetchAntecedents(true)" />
                                    </div>
                                </template>
                            </MultiSelect>
                            <label>Antécédents</label>
                        </FloatLabel>

                        <FloatLabel variant="on" class="">
                            <MultiSelect
                                ref="allergieSelectRef"
                                v-model="form.allergies"
                                :options="allergiesOption || []" 
                                optionLabel="label"
                                optionValue="value"
                                :loading="loadingSelectAllergie"
                                filter 
                                placeholder="" 
                                display="chip"
                                :maxSelectedLabels="2"
                                selectedItemsLabel="{0} éléments sélectionnés" 
                                class="w-full" 
                                size="large" 
                                emptyMessage="Aucune donnée disponible"
                                emptyFilterMessage="Aucun résultat trouvé">
                                <template #header>
                                    <div class="font-medium px-3 py-2">
                                        Vous pouvez sélectionner plusieurs
                                    </div>
                                </template>
                                <template #option="slotProps">
                                    <div class="flex items-center">
                                        <div>
                                            {{ slotProps.option.label }}
                                        </div>
                                    </div>
                                </template>
                                <template #footer>
                                    <div class="p-3 flex justify-between">
                                        <Button label="Ajouter" severity="success" variant="" size="small" icon="pi pi-plus" />
                                        <Button label="Actualiser" severity="warn" variant="" size="small" icon="pi pi-refresh" :loading="loadingSelectAllergieRefresh"
                                        :disabled="loadingSelectAllergieRefresh" 
                                        @click="fetchAllergies(true)" />
                                    </div>
                                </template>
                            </MultiSelect>
                            <label>Allergies</label>
                        </FloatLabel>  

                        <FloatLabel variant="on">
                            <InputText v-model="form.groupe_sanguin" class="w-full" variant="" size="large"/>
                            <label>Groupe sanguin</label>
                        </FloatLabel>
                    </div>
                    <small class="text-red-500">{{ errors.step5 }}</small>
                    <div class="flex pt-6 justify-between">
                        <Button 
                            label="Retour" 
                            severity="danger"
                            icon="pi pi-arrow-left"
                            iconPos="left"
                            @click="activateCallback('4')" 
                        />
                        <Button
                            :disabled="!isStepValid('5')"
                            label="Suivant"
                            severity="success"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            @click="goToStep('6', activateCallback)"
                        />
                    </div>
                </div>
            </StepPanel>

            <!-- STEP 6 -->
            <StepPanel v-slot="{ activateCallback }" value="6">
                <div class="flex flex-col gap-6">

                    <!-- 🔷 STEP TITLE -->
                    <div class="text-center mt-4">
                        <div class="text-2xl font-bold text-blue-600 tracking-wide">
                            {{ currentStepLabel }}
                        </div>
                        <div class="w-16 h-1 bg-blue-500 mx-auto mt-2 rounded"></div>
                    </div>

                    <!-- 🧾 INFORMATIONS DE BASE -->
                    <div class="bg-blue-50 border border-blue-100 rounded-2xl p-5 shadow-sm">
                        <h3 class="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                            <i class="pi pi-user"></i> Informations de base
                        </h3>

                        <div class="grid md:grid-cols-2 gap-3 text-gray-700">
                            <p><span class="font-bold">Nom :</span> {{ form.nom }}</p>
                            <p><span class="font-bold">Prénoms :</span> {{ form.prenoms }}</p>
                            <p><span class="font-bold">Sexe :</span> {{ sexes.find(s => s.value === form.sexe)?.label || '-' }}</p>
                            <p><span class="font-bold">Date de naissance :</span> {{ form.datenais || '-' }}</p>
                            <p class="md:col-span-2"><span class="font-bold">Lieu de naissance :</span> {{ form.lieunais || '-' }}</p>
                        </div>
                    </div>

                    <!-- 📞 CONTACT -->
                    <div class="bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm">
                        <h3 class="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <i class="pi pi-phone"></i> Contact
                        </h3>

                        <div class="grid md:grid-cols-2 gap-3 text-gray-700">
                            <p><span class="font-bold">Téléphone :</span> {{ form.telephone1 }}</p>
                            <p><span class="font-bold">Téléphone secondaire :</span> {{ form.telephone2 || '-' }}</p>
                            <p><span class="font-bold">Email :</span> {{ form.email || '-' }}</p>
                            <p><span class="font-bold">Adresse :</span> {{ form.adresse }}</p>
                        </div>
                    </div>

                    <!-- 🛡️ ASSURANCE -->
                    <div class="bg-green-50 border border-green-100 rounded-2xl p-5 shadow-sm">
                        <h3 class="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                            <i class="pi pi-briefcase"></i> Assurance
                        </h3>

                        <template v-if="isAssure === 1">
                            <div class="grid md:grid-cols-2 gap-3 text-gray-700">
                                <p>
                                    <span class="font-bold">Assurance :</span> 
                                    {{ assurances.find(a => a.value === form.assurance_id)?.label || '-' }}
                                </p>
                                <p><span class="font-bold">Numéro :</span> {{ form.numero_assure }}</p>
                                <p><span class="font-bold">Taux :</span> 
                                    <span class="text-green-600 font-bold">{{ form.taux }}%</span>
                                </p>
                            </div>
                        </template>

                        <template v-else>
                            <p class="text-gray-500 italic">Aucune assurance</p>
                        </template>
                    </div>

                    <!-- 🚑 URGENCES -->
                    <div class="bg-red-50 border border-red-100 rounded-2xl p-5 shadow-sm">
                        <h3 class="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                            <i class="pi pi-exclamation-triangle"></i> Contacts d'urgence
                        </h3>

                        <div class="grid md:grid-cols-2 gap-4">
                            <template v-if="urgencesValides.length > 0">
                                <div 
                                    v-for="(u, index) in urgencesValides" 
                                    :key="index"
                                    class="bg-white border border-red-100 rounded-xl p-4 shadow-sm"
                                >
                                    <p><span class="font-bold">Nom :</span> {{ u.nom }}</p>
                                    <p><span class="font-bold">Lien :</span> {{ u.lien || '-' }}</p>
                                    <p><span class="font-bold">Téléphone :</span> {{ u.telephone1 }}</p>

                                    <p v-if="u.telephone2">
                                        <span class="font-bold">Secondaire :</span> {{ u.telephone2 }}
                                    </p>
                                </div>
                            </template>

                            <template v-else>
                                <p class="text-gray-500 italic">Aucun contact d'urgence</p>
                            </template>
                        </div>
                    </div>

                    <!-- ❤️ INFOS MÉDICALES -->
                    <div class="bg-purple-50 border border-purple-100 rounded-2xl p-5 shadow-sm">
                        <h3 class="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                            <i class="pi pi-heart"></i> Infos médicales
                        </h3>

                        <div class="space-y-3 text-gray-700">

                            <p>
                                <span class="font-bold">Groupe sanguin :</span> 
                                <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg">
                                    {{ form.groupe_sanguin || '-' }}
                                </span>
                            </p>

                            <p>
                                <span class="font-bold">Antécédents :</span>
                                <span class="text-gray-800">
                                    {{ antecedentsLabels }}
                                </span>
                            </p>

                            <p>
                                <span class="font-bold">Allergies :</span>
                                <span class="text-red-600 font-medium">
                                    {{ allergiesLabels }}
                                </span>
                            </p>

                        </div>
                    </div>

                    <!-- ✅ CONFIRMATION -->
                    <div class="bg-gray-100 border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                        <Checkbox v-model="checked" binary />
                        <span class="text-gray-700 font-medium">
                            Je confirme les informations saisies
                        </span>
                    </div>

                </div>

                <div class="flex flex-wrap items-center gap-4 pt-6">             
                    <!-- Actions -->
                    <Button
                        label="Retour"
                        severity="danger"
                        icon="pi pi-arrow-left"
                        class="w-auto"
                        @click="activateCallback('5')" 
                    />
                    <Button
                        icon="pi pi-refresh"
                        severity="warn"
                        label="Réinitialiser"
                        class="w-auto"
                        @click="goToStepReset(activateCallback)" 
                    />
                    <Button
                        @click="submitForm"
                        icon="pi pi-check"
                        severity="success"
                        :loading="loadingForm"
                        :label="loadingForm ? 'En cours...' : 'Enregistrer'"
                        class="w-auto"
                    />
                </div>
            </StepPanel>
        </StepPanels>
    </Stepper>
</div>

</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue';
import TitrePage from '@/layout/elements/TitrePage.vue';
import { number, formaDateHeure } from '@/function/services/format';
import { useScript } from './script'
import { useToastAlert } from '@/function/function/ToastAlert'

const { showToast } = useToastAlert()

const {
        form,
        antecedentsOption,
        allergiesOption,
        sexes,
        assurances,
        isAssure,
        optionAssure,
        loadingSelectAssurance,
        loadingSelectAntecedent,
        loadingSelectAllergie,
        loadingSelectAssuranceRefresh,
        loadingSelectAntecedentRefresh,
        loadingSelectAllergieRefresh,
        assuranceSelectRef,
        antecedentSelectRef,
        allergieSelectRef,
        checked,
        submitted,
        loadingForm,
        fetchAssurances,
        fetchAntecedents,
        fetchAllergies,
        submitForm,

        antecedentsLabels,
        allergiesLabels,
        urgencesValides,

        urgences,
        addUrgence,
        removeUrgence,

        steps,
        currentStep,
        currentStepLabel,

        errors,

        validateStep1,
        validateStep2,
        validateStep3,
        validateStep4,
        validateStep5,

        isStepValid,

        goToStep,

        goToStepReset
} = useScript()

onMounted(() => {
    fetchAssurances()
    fetchAntecedents()
    fetchAllergies()
})

// Watch sur form.taux
watch(
    () => form.value.taux,
    async (newVal) => {

        // 🔹 Si vide → remettre 0
        if (newVal === '' || newVal === null || newVal === undefined) {
            await nextTick()
            form.value.taux = 0
            return
        }

        // 🔹 garder uniquement chiffres
        let filtered = number(newVal)

        // 🔹 supprimer les zéros au début (ex: 05 → 5)
        filtered = filtered.replace(/^0+/, '')

        // 🔹 si tout supprimé → remettre 0
        if (filtered === '') {
            filtered = 0
        }

        // 🔹 limiter à 3 chiffres
        filtered = filtered.slice(0, 3)

        // 🔹 contrôle max 100
        let numericValue = parseInt(filtered)

        if (numericValue > 100) {
            filtered = '100'
            showToast('warn', 'Attention', "Le taux (%) ne peut pas dépasser 100%")
        }

        // 🔹 éviter boucle infinie
        if (filtered !== newVal) {
            await nextTick()
            form.value.taux = filtered
        }
    }
)

// Watch sur form.telephone
watch(
    () => form.value.telephone1,
    async (newVal, oldVal) => {
        if (!newVal) return

        // filtrer uniquement les chiffres
        let filtered = number(newVal)

        // forcer + au début
        if (!filtered.startsWith('+')) {
            filtered = '+' + filtered
        }

        // mettre à jour seulement si différent
        if (filtered !== newVal) {
            await nextTick()
            form.value.telephone1 = filtered
        }
    }
)

watch(
    () => form.value.telephone2,
    async (newVal, oldVal) => {
        if (!newVal) return

        // filtrer uniquement les chiffres
        let filtered = number(newVal)

        // forcer + au début
        if (!filtered.startsWith('+')) {
            filtered = '+' + filtered
        }

        // mettre à jour seulement si différent
        if (filtered !== newVal) {
            await nextTick()
            form.value.telephone2 = filtered
        }
    }
)

// Watch sur urgences.telephone
watch(
    urgences,
    async (newVal) => {
        for (let i = 0; i < newVal.length; i++) {
            const u = newVal[i]

            // 🔹 téléphone1
            if (u.telephone1) {
                let filtered = number(u.telephone1) // filtrer uniquement les chiffres
                if (!filtered.startsWith('+')) {    // forcer + au début
                    filtered = '+' + filtered
                }
                if (filtered !== u.telephone1) {    // mettre à jour seulement si différent
                    await nextTick()
                    u.telephone1 = filtered
                }
            }

            // 🔹 téléphone2
            if (u.telephone2) {
                let filtered = number(u.telephone2) // filtrer uniquement les chiffres
                if (!filtered.startsWith('+')) {    // forcer + au début
                    filtered = '+' + filtered
                }
                if (filtered !== u.telephone2) {    // mettre à jour seulement si différent
                    await nextTick()
                    u.telephone2 = filtered
                }
            }
        }
    },
    { deep: true } // pour détecter les changements à l'intérieur de urgences.value
)

watch(isAssure, (val) => {
    if (!val) {
        form.value.assurance_id = null
        form.value.numero_assure = ''
        form.value.taux = 0
    }
})
</script>

<style scoped lang="scss">

</style>
 