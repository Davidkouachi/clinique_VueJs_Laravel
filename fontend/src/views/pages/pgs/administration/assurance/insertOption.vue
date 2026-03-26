<template>
    <div class="flex flex-col gap-2">
        <div class="flex flex-col justify-center items-center">
            <img height="100" width="100" src="@/assets/img/fiche.png" />
        </div>
    </div>
    <form id="medecinForm" @submit.prevent="formSubmit" class="flex flex-col gap-4 w-full mt-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Nom -->
            <FloatLabel variant="on">
                <InputText id="nom" v-model="nom" size="large" class="w-full" variant="filled" :invalid="submitted && !nom" @input="nom = nom.toUpperCase()"/>
                <label for="nom">Nom</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="email" v-model="email" size="large" class="w-full" variant="filled" />
                <label for="email">Email</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText
                    v-model="telephone1"
                    id="telephone1"
                    inputmode="tel"
                    placeholder=""
                    size="large" class="w-full"
                    :invalid="submitted && !telephone1" 
                    variant="filled"
                />
                <label for="telephone1">Contact 1</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText
                    v-model="telephone2"
                    id="telephone2"
                    inputmode="tel"
                    placeholder=""
                    size="large" class="w-full"
                    variant="filled"
                />
                <label for="telephone2">Contact 2</label>
            </FloatLabel>
            <FloatLabel class="w-full" variant="on">
                <Select
                    fluid
                    appendTo="self"
                    class="w-full"
                    v-model="type"
                    inputId="on_label" 
                    :options="types"
                    optionLabel="label"
                    optionValue="value"
                    placeholder=""
                    variant="filled"
                    size="large" />
                <label for="on_label">Type</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="adresse" v-model="adresse" size="large" class="w-full" variant="filled" :invalid="submitted && !adresse" />
                <label for="adresse">Adresse</label>
            </FloatLabel>
        </div>
        <div class="flex items-center gap-2 mt-10">
            <Checkbox v-model="checked" binary />
            <span>Je confirme les informations</span>
        </div>
    </form>

</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import axios from 'axios';
import { useDialogStore } from '@/function/stores/dialog'
import { useToastAlert } from '@/function/function/ToastAlert';
import { number, isValidEmail } from '@/function/services/format';

const props = defineProps({
  	data: Object,
  	fetchLists: Function,
  	updateRowById: Function,
  	addRow: Function,
  	editMode: Boolean,
  	editUid: [Number, String]
})

const dialogUse = useDialogStore();
const { showToast } = useToastAlert();

const editMode = ref(false);
const editUid = ref(null);

const nom = ref('')
const telephone1 = ref('')
const telephone2 = ref('')
const email = ref('')
const adresse = ref('')
const type = ref(null)
const types = [
    { label: 'Privé', value: 1 },
    { label: 'Public', value: 0 },
];
const checked = ref(false);
const loadingForm = ref(false);
const submitted = ref(false)

const reset = () => {
   	editMode.value = false;
    editUid.value = null;
    nom.value = '';
    telephone1.value = '';
    telephone2.value = '';
    email.value = '';
    adresse.value = '';
    type.value = null;
    checked.value = false;
    submitted.value = false;
};

const formSubmit = async () => {

    submitted.value = true

    if (!nom.value || !telephone1.value || !adresse.value || type.value === null) {
        showToast('warn', 'Alerte', 'Formulaire incomplet')
        return
    }

    if (email.value && email.value.trim() !== '') {

        if (!isValidEmail(email.value)) {
            showToast(
                'warn',
                'Email invalide',
                'Veuillez saisir une adresse email valide'
            );
            return false;
        }
    }

    if (!checked.value) {
        showToast('warn', 'Alerte', 'Veuillez confirmer les informations');
        return;
    }

    dialogUse.setFooterLoading('DialogBtn')

    try {

      	const payload = {
	        nom: nom.value,
            email: email.value,
            telephone1: telephone1.value,
            telephone2: telephone2.value,
            adresse: adresse.value,
            type: type.value
	    };

	    let res;

	    if (editMode.value) {
	        // UPDATE
	        res = await axios.put(
	            `/api/v1/api_update_assurances/${editUid.value}`,
	            payload
	        );
	    } else {
	        // INSERT
	        res = await axios.post(
	            `/api/v1/api_insert_assurances`,
	            payload
	        );
	    }

	    if (res.status === 200) {

	    	if (editMode.value) {

		    	props.updateRowById?.(editUid.value, {
		            nom: nom.value,
                    email: email.value,
                    telephone1: telephone1.value,
                    telephone2: telephone2.value,
                    adresse: adresse.value,
                    type: type.value,
                    type_label: type.value === 1 ? 'Privé' : 'Public'
		        })

	        } else {

			    props.addRow?.({
                    id: res.data.data.id,
                    uid: res.data.data.uid,
                    code: res.data.data.code,
                    nom: nom.value,
                    email: email.value,
                    telephone1: telephone1.value,
                    telephone2: telephone2.value,
                    adresse: adresse.value,
                    type: type.value,
                    type_label: res.data.data.type_label,
                    statut: 1,
                    statut_label: res.data.data.statut_label,
                    created_at: res.data.data.created_at
                })
			}

	        showToast('success', 'Succès', res.data.msg);
	        reset()
        	dialogUse.hide()

	    } else {

	        showToast('warn', 'Alerte', res.data.msg);

	    }

   } catch (err) {

      showToast(
         'error',
         'Erreur',
         err.response?.data?.msg || 'Erreur serveur'
      )
   } finally {

       dialogUse.clearFooterLoading()
   }
}

defineExpose(
    { submit: formSubmit }
)

watch(() => props.data, (val) => {
    if (val) {

  	    nom.value = val.nom;
        telephone1.value = val.telephone1;
        telephone2.value = val.telephone2;
        email.value = val.email;
        adresse.value = val.adresse;
        type.value = Number(val.type);

    }
}, { immediate: true })

watch(() => props.editMode, (val) => {
    editMode.value = val ?? false
}, { immediate: true })

watch(() => props.editUid, (val) => {
    editUid.value = val ?? null
}, { immediate: true })

watch(
    () => telephone1.value,
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
            telephone1.value = filtered
        }
    }
)

watch(
    () => telephone2.value,
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
            telephone2.value = filtered
        }
    }
)
</script>

