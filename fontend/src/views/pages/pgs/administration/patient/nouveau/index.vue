<template>
    <TitrePage />
<form @submit.prevent="submitForm" class="card space-y-6">

    <!-- 🧾 IDENTITÉ -->
    <Fieldset legend="Identité">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

            <FloatLabel variant="on">
                <InputText id="nom" v-model="form.nom" class="w-full" variant="filled" :invalid="submitted && !form.nom" @input="form.nom = form.nom.toUpperCase()" />
                <label for="nom">Nom *</label>
            </FloatLabel>

            <FloatLabel variant="on">
                <InputText id="prenoms" v-model="form.prenoms" class="w-full" variant="filled"
                    :invalid="submitted && !form.prenoms" />
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
                />
                <label>Sexe *</label>
            </FloatLabel>

            <FloatLabel variant="on">
                <DatePicker
                    v-model="form.datenais"
                    class="w-full"
                    dateFormat="dd/mm/yy"
                    :maxDate="new Date()"
                />
                <label>Date de naissance *</label>
            </FloatLabel>

            <FloatLabel variant="on">
                <InputText v-model="form.lieunais" class="w-full" variant="filled"/>
                <label>Lieu de naissance</label>
            </FloatLabel>

        </div>
    </Fieldset>

    <!-- 📞 CONTACT -->
    <Fieldset legend="Contact">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

            <FloatLabel variant="on">
                <InputText v-model="form.telephone1" class="w-full" variant="filled"
                    :invalid="submitted && !form.telephone1"/>
                <label>Téléphone *</label>
            </FloatLabel>

            <FloatLabel variant="on">
                <InputText v-model="form.telephone2" class="w-full" variant="filled"/>
                <label>Téléphone secondaire</label>
            </FloatLabel>

            <FloatLabel variant="on">
                <InputText v-model="form.email" class="w-full" variant="filled"/>
                <label>Email</label>
            </FloatLabel>

            <FloatLabel variant="on">
                <InputText v-model="form.adresse" class="w-full" variant="filled"
                    :invalid="submitted && !form.adresse"/>
                <label>Adresse *</label>
            </FloatLabel>

        </div>
    </Fieldset>

    <!-- 🏥 ASSURANCE -->
    <Fieldset legend="Assurance">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="col-span-1 md:col-span-2 mt-2">
                <label class="font-medium">Êtes-vous assuré ?</label>

                <div class="flex gap-6 mt-2">
                    <div class="flex items-center gap-2">
                        <RadioButton v-model="isAssure" :value="true" inputId="assure_oui" />
                        <label for="assure_oui">Oui</label>
                    </div>

                    <div class="flex items-center gap-2">
                        <RadioButton v-model="isAssure" :value="false" inputId="assure_non" />
                        <label for="assure_non">Non</label>
                    </div>
                </div>
            </div>

            <template v-if="isAssure" >

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
                        />
                        <label>Assurance</label>
                    </FloatLabel>
                    <Button
                        icon="pi pi-refresh"
                        size="normal"
                        severity="secondary"
                        :loading="loadingSelectAssuranceRefresh"
                        :disabled="loadingSelectAssuranceRefresh" 
                        @click="fetchAssurances(true)"
                        variant="filled"
                    />
                </div>

                <FloatLabel variant="on">
                    <InputText v-model="form.numero_assure" class="w-full" variant="filled" :invalid="submitted && !form.numero_assure && isAssure"/>
                    <label>Numéro assuré</label>
                </FloatLabel>

                <FloatLabel variant="on">
                    <InputText v-model="form.taux" class="w-full" variant="filled" :invalid="submitted && !form.taux && isAssure"/>
                    <label>Taux (%)</label>
                </FloatLabel>
            </template>

        </div>
    </Fieldset>

    <!-- 🚨 URGENCE -->
    <Fieldset legend="Contact d'urgence">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

            <FloatLabel variant="on">
                <InputText v-model="form.urgence_nom" class="w-full" variant="filled"/>
                <label>Nom</label>
            </FloatLabel>

            <FloatLabel variant="on">
                <InputText v-model="form.urgence_lien" class="w-full" variant="filled"/>
                <label>Lien</label>
            </FloatLabel>

            <FloatLabel variant="on">
                <InputText v-model="form.urgence_tel1" class="w-full" variant="filled"/>
                <label>Téléphone *</label>
            </FloatLabel>

            <FloatLabel variant="on">
                <InputText v-model="form.urgence_tel2" class="w-full" variant="filled"/>
                <label>Téléphone secondaire</label>
            </FloatLabel>

        </div>
    </Fieldset>

    <!-- 🧠 INFOS MÉDICALES -->
    <Fieldset legend="Informations médicales">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

            <FloatLabel variant="on">
                <InputText v-model="form.groupe_sanguin" class="w-full" variant="filled"/>
                <label>Groupe sanguin</label>
            </FloatLabel>

            <FloatLabel variant="on">
                <InputText v-model="form.allergies" class="w-full" variant="filled"/>
                <label>Allergies</label>
            </FloatLabel>

            <FloatLabel variant="on">
                <InputText v-model="form.antecedents" class="w-full" variant="filled"/>
                <label>Antécédents</label>
            </FloatLabel>

        </div>
    </Fieldset>

    <!-- ✅ VALIDATION -->
    <div class="flex items-center gap-2">
        <Checkbox v-model="checked" binary />
        <span>Je confirme les informations</span>
    </div>

    <!-- 🔘 ACTION -->
    <div class="flex flex-wrap gap-2 mt-4">
        <div class="col-6">
            <Button
                icon="pi pi-times"
                severity="danger"
                label="Rémise à zéro"
                size="large"
                class="w-full"
                :fluid="false"
                @click="resetForm" 
            />
        </div>
        <div class="col-6">
            <Button
                type="submit"
                icon="pi pi-check"
                severity="success"
                :loading="loadingForm"
                :label="loadingForm ? 'Opération en cours...' : 'Enregistrer'"
                size="large"
                class="w-full"
                :fluid="false"
            />
        </div>
    </div>

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
    loadingSelectAssurance,
    loadingSelectAssuranceRefresh,
    checked,
    submitted,
    loadingForm,
    fetchAssurances,
    submitForm,
    resetForm
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
