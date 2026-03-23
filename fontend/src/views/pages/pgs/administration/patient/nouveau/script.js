import { ref, reactive, computed } from 'vue'
import axios from 'axios'
import { useToastAlert } from '@/function/function/ToastAlert'
import { isValidEmail } from '@/function/services/format'

export function useScript() {

    const { showToast } = useToastAlert()

    const steps = [
    { value: '1', icon: 'pi pi-user', label: 'Informations de base' },
    { value: '2', icon: 'pi pi-phone', label: 'Contact' },
    { value: '3', icon: 'pi pi-briefcase', label: 'Assurance' },
    { value: '4', icon: 'pi pi-exclamation-triangle', label: 'Urgence' },
    { value: '5', icon: 'pi pi-heart', label: 'Infos médicales' },
    { value: '6', icon: 'pi pi-check-circle', label: 'Validation' }
]


	const currentStep = ref('1')

	const currentStepLabel = computed(() => {
	    const step = steps.find(s => s.value === currentStep.value)
	    return step ? step.label : ''
	})

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
        groupe_sanguin: '',
        allergies: '',
        antecedents: ''
    })

    const urgences = ref([
	    {
	        nom: '',
	        lien: '',
	        telephone1: '',
	        telephone2: ''
	    }
	])

	const addUrgence = () => {
	    urgences.value.push({
	        nom: '',
	        lien: '',
	        telephone1: '',
	        telephone2: ''
	    })
	}

	const removeUrgence = (index) => {
	    if (urgences.value.length === 1) return // 🔒 au moins 1
	    urgences.value.splice(index, 1)
	}

	const cleanUrgences = () => {
	    urgences.value = [
	        {
	            nom: '',
	            lien: '',
	            telephone1: '',
	            telephone2: ''
	        }
	    ]
	}

	const errors = reactive({
	    step1: '',
	    step2: '',
	    step3: '',
	    step4: '',
	    step5: ''
	})

	// --------------------------------------------------------

	const validateStep1 = () => {
	    // if (!form.nom) {
	    //     errors.step1 = "Tous les champs sont obligatoires"
	    //     return false
	    // }
	    errors.step1 = ''
	    return true
	}

	const validateStep2 = () => {
	    // if (!form.prenom) {
	    //     errors.step2 = "Tous les champs sont obligatoires"
	    //     return false
	    // }
	    errors.step2 = ''
	    return true
	}

	const validateStep3 = () => {
	    errors.step3 = ''
	    return true
	}

	const validateStep4 = () => {
	    errors.step4 = ''
	    return true
	}

	const validateStep5 = () => {
	    errors.step5 = ''
	    return true
	}

	// --------------------------------------------------------

	const isStep1Valid = computed(() => {
	    return form.value.nom !== ''
	})

	const isStep2Valid = computed(() => {
	    return form.value.prenom !== ''
	})

	const isStep3Valid = computed(() => {
	    return form.value.prenom !== ''
	})

	const isStep4Valid = computed(() => {
	    return form.value.prenom !== ''
	})

	const isStep5Valid = computed(() => {
	    return form.value.prenom !== ''
	})

	// --------------------------------------------------------

	const goToStep2 = (activateCallback) => {
	    if (validateStep1()) {
	        activateCallback('2')
	    }
	}

	const goToStep3 = (activateCallback) => {
	    if (validateStep2()) {
	        activateCallback('3')
	    }
	}

	const goToStep4 = (activateCallback) => {
	    if (validateStep3()) {
	        activateCallback('4')
	    }
	}

	const goToStep5 = (activateCallback) => {
	    if (validateStep4()) {
	        activateCallback('5')
	    }
	}

	const goToStep6 = (activateCallback) => {
	    if (validateStep5()) {
	        activateCallback('6')
	    }
	}

	// --------------------------------------------------------

	const goToStepReset = (activateCallback) => {
	    // Revenir au premier step
	    currentStep.value = '1'

	    // Reset formulaire
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
        isAssure.value = 0

	    // Reset erreurs
	    errors.step1 = ''
	    errors.step2 = ''
	    errors.step3 = ''
	    errors.step4 = ''
	    errors.step5 = ''

	    cleanUrgences()

	    activateCallback('1')
	}

	// --------------------------------------------

    const sexes = [
        { label: 'Masculin', value: 'M' },
        { label: 'Féminin', value: 'F' }
    ]

    const optionAssure = [
        { label: 'Non', value: 0 },
        { label: 'Oui', value: 1 }
    ]

    const assurances = ref([])
    const isAssure = ref(0)
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

	const validateUrgences = () => {
	    for (let i = 0; i < urgences.value.length; i++) {
	        const u = urgences.value[i]

	        // téléphone obligatoire
	        if (!u.telephone1) {
	            showToast(
	                'warn',
	                'Alerte',
	                `Téléphone obligatoire pour le contact d'urgence #${i + 1}`
	            )
	            return false
	        }

	        // nom optionnel mais recommandé
	        if (!u.nom) {
	            showToast(
	                'warn',
	                'Alerte',
	                `Nom manquant pour le contact d'urgence #${i + 1}`
	            )
	            return false
	        }

	        // lien optionnel mais recommandé
	        if (!u.lien) {
	            showToast(
	                'warn',
	                'Alerte',
	                `Lien manquant pour le contact d'urgence #${i + 1}`
	            )
	            return false
	        }
	    }

	    return true
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

		if (!validateUrgences()) {
		    return
		}

		// BONUS (anti doublon téléphone 🔥)
		const phones = urgences.value.map(u => u.telephone1)

		const hasDuplicate = phones.some((p, i) => phones.indexOf(p) !== i)

		if (hasDuplicate) {
		    showToast('warn', 'Alerte', 'Numéros en double interdits')
		    return false
		}

		// VERSION ULTRA PRO (tolérance + suppression des vides)
		const cleanUrgences = urgences.value
		    .filter(u => u.telephone1) // garder seulement les valides
		    .map(u => ({
		        nom: u.nom || null,
		        lien: u.lien || null,
		        telephone1: u.telephone1,
		        telephone2: u.telephone2 || null
		    }))

        if (!checked.value) {
            showToast('warn', 'Alerte', 'Veuillez confirmer les informations')
            return
        }

        loadingForm.value = true

        const payload = {
		    ...form.value,
		    urgences: urgences.value
		}

        try {
            const res = await axios.post('/api/v1/api_insert_patient', payload)

            // $request->validate([
			//     'nom' => 'required',
			//     'prenoms' => 'required',
			//     'telephone1' => 'required',
			//     'urgences' => 'required|array|min:1',
			//     'urgences.*.telephone1' => 'required'
			// ]);

			// foreach ($request->urgences as $urgence) {
			//     PatientUrgence::create([
			//         'patient_id' => $patient->id,
			//         'nom' => $urgence['nom'],
			//         'lien' => $urgence['lien'],
			//         'telephone1' => $urgence['telephone1'],
			//         'telephone2' => $urgence['telephone2'],
			//     ]);
			// }

            if (res.status === 200) {
                showToast('success', 'Succès', res.data.msg)
                cleanUrgences()
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
    }
}