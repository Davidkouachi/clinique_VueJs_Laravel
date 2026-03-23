<template>
    <TitrePage />

<form @submit.prevent="submitForm" class="card flex flex-col gap-6 justify-center mb-0">
    <div class="text-center mt-4 mb-4 text-2xl font-bold">
        FORMULAIRE
    </div>
    <Stepper linear value="1" v-model:value="currentStep" class="basis-full">
        
        <StepList >
            <Step v-for="(step, index) in steps" :key="step.value" v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="step.value">
                <!-- si c'est le dernier step -->
                <div :class="index === steps.length - 1 ? 'flex flex-row pl-2' : 'flex flex-row flex-auto gap-2'" v-bind="a11yAttrs.root">
                    <button class="bg-transparent border-0 inline-flex flex-col gap-2" @click="activateCallback" v-bind="a11yAttrs.header">
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
                <div class="flex flex-col gap-3">
                    <div class="text-center mt-4 mb-4 text-xl font-semibold">
                        {{ currentStepLabel }}
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-3">

                        <FloatLabel variant="on">
                            <InputText id="nom" v-model="form.nom" class="w-full" variant="filled" :invalid="submitted && !form.nom" @input="form.nom = form.nom.toUpperCase()" size="large" />
                            <label for="nom">Nom *</label>
                        </FloatLabel>

                        <FloatLabel variant="on">
                            <InputText id="prenoms" v-model="form.prenoms" class="w-full" variant="filled"
                                :invalid="submitted && !form.prenoms" size="large"/>
                            <label for="prenoms">Prénoms *</label>
                        </FloatLabel>

                        <FloatLabel variant="on">
                            <Select
                                v-model="form.sexe"
                                :options="sexes"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                variant="filled"
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
                            <InputText v-model="form.lieunais" class="w-full" variant="filled" size="large"/>
                            <label>Lieu de naissance</label>
                        </FloatLabel>

                    </div>
                    <small class="text-red-500">{{ errors.step1 }}</small>
                </div>

                <div class="flex pt-6 justify-end">
                    <Button
                        :disabled="!isStep1Valid"
                        label="Suivant"
                        severity="success"
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        @click="goToStep2(activateCallback)" 
                    />
                </div>
            </StepPanel>

            <!-- STEP 2 -->
            <StepPanel v-slot="{ activateCallback }" value="2">
                <div class="flex flex-col gap-3">
                    <div class="text-center mt-4 mb-4 text-xl font-semibold">
                        {{ currentStepLabel }}
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-3">

                        <FloatLabel variant="on">
                            <InputText v-model="form.telephone1" class="w-full" variant="filled"
                                :invalid="submitted && !form.telephone1" size="large"/>
                            <label>Téléphone *</label>
                        </FloatLabel>

                        <FloatLabel variant="on">
                            <InputText v-model="form.telephone2" class="w-full" variant="filled" size="large"/>
                            <label>Téléphone secondaire</label>
                        </FloatLabel>

                        <FloatLabel variant="on">
                            <InputText v-model="form.email" class="w-full" variant="filled" size="large"/>
                            <label>Email</label>
                        </FloatLabel>

                        <FloatLabel variant="on">
                            <InputText v-model="form.adresse" class="w-full" variant="filled"
                                :invalid="submitted && !form.adresse" size="large"/>
                            <label>Adresse *</label>
                        </FloatLabel>

                    </div>
                    <small class="text-red-500">{{ errors.step2 }}</small>
                </div>

                <div class="flex pt-6 justify-between">
                    <Button 
                        label="Retour" 
                        severity="danger"
                        icon="pi pi-arrow-left"
                        iconPos="left"
                        @click="activateCallback('1')" 
                    />
                    <Button
                        :disabled="!isStep2Valid"
                        label="Suivant"
                        severity="success"
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        @click="goToStep3(activateCallback)" 
                    />
                </div>
            </StepPanel>

            <!-- STEP 3 -->
            <StepPanel v-slot="{ activateCallback }" value="3">
                <div class="flex flex-col gap-3">
                    <div class="text-center mt-4 mb-4 text-xl font-semibold">
                        {{ currentStepLabel }}
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-3">

                        <FloatLabel variant="on">
                            <Select
                                v-model="isAssure"
                                :options="optionAssure"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                variant="filled"
                                size="large"
                            />
                            <label>Vous êtes assuré *</label>
                        </FloatLabel>

                        <template v-if="isAssure === 1" >

                            <div class="flex gap-2 w-full">
                                <FloatLabel variant="on" class="flex-1">
                                    <Select
                                        filter
                                        v-model="form.assurance_id"
                                        :options="assurances || []"
                                        optionLabel="label"
                                        optionValue="value"
                                        class="w-full"
                                        appendTo="body"
                                        :loading="loadingSelectAssurance"
                                        emptyMessage="Aucune donnée disponible"
                                        emptyFilterMessage="Aucun résultat trouvé"
                                        :invalid="submitted && !form.assurance_id && isAssure"
                                        size="large"
                                    />
                                    <label>Assurance</label>
                                </FloatLabel>
                                <Button
                                    icon="pi pi-refresh"
                                    size="large"
                                    severity="secondary"
                                    :loading="loadingSelectAssuranceRefresh"
                                    :disabled="loadingSelectAssuranceRefresh" 
                                    @click="fetchAssurances(true)"
                                    variant="filled"
                                />
                            </div>

                            <FloatLabel variant="on">
                                <InputText v-model="form.numero_assure" class="w-full" variant="filled" :invalid="submitted && !form.numero_assure && isAssure" size="large"/>
                                <label>Numéro assuré</label>
                            </FloatLabel>

                            <FloatLabel variant="on">
                                <InputText v-model="form.taux" class="w-full" variant="filled" :invalid="submitted && !form.taux && isAssure" size="large"/>
                                <label>Taux (%)</label>
                            </FloatLabel>

                        </template>

                    </div>
                    <small class="text-red-500">{{ errors.step2 }}</small>
                </div>

                <div class="flex pt-6 justify-between">
                    <Button 
                        label="Retour" 
                        severity="danger"
                        icon="pi pi-arrow-left"
                        iconPos="left"
                        @click="activateCallback('2')" 
                    />
                    <Button
                        :disabled="!isStep2Valid"
                        label="Suivant"
                        severity="success"
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        @click="goToStep4(activateCallback)" 
                    />
                </div>
            </StepPanel>

            <!-- STEP 4 -->
            <StepPanel v-slot="{ activateCallback }" value="4">
                <div class="flex flex-col gap-3">
                    <div class="text-center mt-4 mb-4 text-xl font-semibold">
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
                    <small class="text-red-500">{{ errors.step2 }}</small>
                </div>

                <div class="flex pt-6 justify-between">
                    <Button 
                        label="Retour" 
                        severity="danger"
                        icon="pi pi-arrow-left"
                        iconPos="left"
                        @click="activateCallback('3')" 
                    />
                    <Button
                        :disabled="!isStep2Valid"
                        label="Suivant"
                        severity="success"
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        @click="goToStep5(activateCallback)" 
                    />
                </div>
            </StepPanel>

            <!-- STEP 5 -->
            <StepPanel v-slot="{ activateCallback }" value="5">
                <div class="flex flex-col gap-3">
                    <div class="text-center mt-4 mb-4 text-xl font-semibold">
                        {{ currentStepLabel }}
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-3">

                        <FloatLabel variant="on">
                            <Textarea v-model="form.allergies" rows="5" cols="30" style="resize: none" size="large" variant="filled" class="w-full"/>
                            <label>Allergies</label>
                        </FloatLabel>

                        <FloatLabel variant="on">
                            <Textarea v-model="form.antecedents" rows="5" cols="30" style="resize: none" size="large" variant="filled" class="w-full"/>
                            <label>Antécédents</label>
                        </FloatLabel>

                        <FloatLabel variant="on">
                            <InputText v-model="form.groupe_sanguin" class="w-full" variant="filled" size="large"/>
                            <label>Groupe sanguin</label>
                        </FloatLabel>

                    </div>
                    <small class="text-red-500">{{ errors.step2 }}</small>
                </div>

                <div class="flex pt-6 justify-between">
                    <Button 
                        label="Retour" 
                        severity="danger"
                        icon="pi pi-arrow-left"
                        iconPos="left"
                        @click="activateCallback('4')" 
                    />
                    <Button
                        :disabled="!isStep2Valid"
                        label="Suivant"
                        severity="success"
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        @click="goToStep6(activateCallback)" 
                    />
                </div>
            </StepPanel>

            <!-- STEP 6 -->
            <StepPanel v-slot="{ activateCallback }" value="6">
                <div class="flex flex-col gap-2">
                    <div class="text-center mt-4 mb-4 text-xl font-semibold">
                        {{ currentStepLabel }}
                    </div>
                    <p><strong>Nom:</strong> {{ form.nom }}</p>
                    <p><strong>Prénom:</strong> {{ form.prenom }}</p>
                    <div class="flex items-center gap-2">
                        <Checkbox v-model="checked" binary />
                        <span>Je confirme les informations</span>
                    </div>
                </div>

                <div class="flex pt-6 justify-between">
                    <div class="flex flex-wrap gap-2 mt-4">
                        <Button
                            label="Retour"
                            severity="danger"
                            icon="pi pi-arrow-left"
                            iconPos="left"
                            size="small"
                            :fluid="false"
                            @click="goToStep5(activateCallback)"
                        />
                    </div>

                    <div class="flex flex-wrap gap-2 mt-4">
                        <Button
                            icon="pi pi-times"
                            severity="warn"
                            label="Rémise à zéro"
                            size="large"
                            class=""
                            :fluid="false"
                            @click="goToStepReset(activateCallback)" 
                        />
                        <Button
                            type="submit"
                            icon="pi pi-check"
                            severity="success"
                            :loading="loadingForm"
                            :label="loadingForm ? 'Opération en cours...' : 'Enregistrer'"
                            size="normal"
                            class=""
                            :fluid="false"
                        />
                    </div>
                </div>
            </StepPanel>

        </StepPanels>
    </Stepper>
</form>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue';
import TitrePage from '@/layout/elements/TitrePage.vue';
import { number } from '@/function/services/format';
import { useScript } from './script'
import { useToastAlert } from '@/function/function/ToastAlert'

const { showToast } = useToastAlert()

const {
        form,
        sexes,
        assurances,
        isAssure,
        optionAssure,
        loadingSelectAssurance,
        loadingSelectAssuranceRefresh,
        checked,
        submitted,
        loadingForm,
        fetchAssurances,
        submitForm,

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

        isStep1Valid,
        isStep2Valid,
        isStep3Valid,
        isStep4Valid,
        isStep5Valid,

        goToStep2,
        goToStep3,
        goToStep4,
        goToStep5,
        goToStep6,

        goToStepReset
} = useScript()

onMounted(() => {
    fetchAssurances()
})

watch(
    () => form.value.taux,
    async (newVal) => {
        if (!newVal) return

        // 🔹 garder uniquement chiffres
        let filtered = number(newVal)

        // 🔹 limiter à 3 chiffres
        filtered = filtered.slice(0, 3)

        // 🔹 convertir en nombre pour contrôle max
        let numericValue = parseInt(filtered || '0')

        if (numericValue > 100) {
            filtered = '100'
            showToast('warn', 'Attention', 'le taux (%) de couverture d\'assurance ne dépasse pas 100%')
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
    () => form.value.urgence_tel1,
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
            form.value.urgence_tel1 = filtered
        }
    }
)

watch(
    () => form.value.urgence_tel2,
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
            form.value.urgence_tel2 = filtered
        }
    }
)

watch(isAssure, (val) => {
    if (!val) {
        form.value.assurance_id = null
        form.value.numero_assure = ''
        form.value.taux = ''
    }
})
</script>

<style scoped lang="scss">

</style>
