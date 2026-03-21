import { ref } from 'vue'
import axios from 'axios'
import { useToastAlert } from '@/function/function/ToastAlert'
import { isValidEmail } from '@/function/services/format'

export function useScript() {

    const { showToast } = useToastAlert()

    // 🧠 FORM UNIQUE
    const form = ref({
        nom: '',
        prenoms: '',
        sexe: null,
        datenais: null,
        lieunais: '',
        telephone1: '',
        telephone2: '',
        email: '',
        adresse: '',
        assurance_id: null,
        numero_assure: '',
        taux: '',
        urgence_nom: '',
        urgence_lien: '',
        urgence_tel1: '',
        urgence_tel2: '',
        groupe_sanguin: '',
        allergies: '',
        antecedents: ''
    })

    const sexes = [
        { label: 'Masculin', value: 'M' },
        { label: 'Féminin', value: 'F' }
    ]

    const assurances = ref([])
    const isAssure = ref(false)
    const loadingSelectAssurance = ref(false)
    const loadingSelectAssuranceRefresh = ref(false)

    const checked = ref(false)
    const loadingForm = ref(false)
    const submitted = ref(false)

    // 🔹 FETCH ASSURANCES
    const fetchAssurances = async (refresh) => {
		if(refresh) loadingSelectAssuranceRefresh.value = true
		loadingSelectAssurance.value = true

	    try {
	        const res = await axios.get('/api/v1/select_assurances')
	        assurances.value = res.data.data.map(r => ({
	            label: r.nom,
	            value: r.id
	        }))
	    } catch (e) {
	        showToast('error', 'Erreur', 'Impossible de charger les données')
	    } finally {
	    	loadingSelectAssurance.value = false
	    	if(refresh) loadingSelectAssuranceRefresh.value = false
	    }
	}

    // 🔹 RESET
    const resetForm = () => {
        form.value = {
            nom: '',
            prenoms: '',
            sexe: null,
            datenais: null,
            lieunais: '',
            telephone1: '',
            telephone2: '',
            email: '',
            adresse: '',
            assurance_id: null,
            numero_assure: '',
            taux: '',
            urgence_nom: '',
            urgence_lien: '',
            urgence_tel1: '',
            urgence_tel2: '',
            groupe_sanguin: '',
            allergies: '',
            antecedents: ''
        }

        checked.value = false
        submitted.value = false
    }

    // 🔹 SUBMIT
    const submitForm = async () => {

        submitted.value = true

        // ✅ validation
        if (
            !form.value.nom ||
            !form.value.prenoms ||
            !form.value.sexe ||
            !form.value.telephone1 ||
            !form.value.adresse
        ) {
            showToast('warn', 'Alerte', 'Formulaire incomplet')
            return
        }

        if (form.value.email && !isValidEmail(form.value.email)) {
            showToast('warn', 'Email invalide', 'Veuillez saisir un email valide')
            return
        }

        if (isAssure.value) {
		    if (!form.value.assurance_id || !form.value.numero_assure || !form.value.taux) {
		        showToast('warn', 'Alerte', 'Veuillez saisir toutes les informations du volet assurance')
		        return
		    }
		}

        if (!checked.value) {
            showToast('warn', 'Alerte', 'Veuillez confirmer les informations')
            return
        }

        loadingForm.value = true

        try {
            const res = await axios.post('/api/v1/api_insert_patient', form.value)

            if (res.status === 200) {
                showToast('success', 'Succès', res.data.msg)
                resetForm()
            }

        } catch (err) {
            showToast(
                'error',
                'Erreur',
                err.response?.data?.msg || 'Erreur serveur'
            )
        } finally {
            loadingForm.value = false
        }
    }

    return {
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
    }
}