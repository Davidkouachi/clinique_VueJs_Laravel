import { ref, reactive, computed, nextTick } from 'vue'
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
        taux: 0,
        groupe_sanguin: '',
        allergies: [],
		antecedents: []
    })

	const antecedentSelectRef = ref(null)
    const antecedentsOption = ref([]);
    const loadingSelectAntecedent = ref(false)
    const loadingSelectAntecedentRefresh = ref(false)

    const allergieSelectRef = ref(null)
    const allergiesOption = ref([]);
    const loadingSelectAllergie = ref(false)
    const loadingSelectAllergieRefresh = ref(false)

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

	const controls = {
	    '1': () => {
	        return (
	            form.value.nom !== '' &&
	            form.value.prenoms !== '' &&
	            form.value.sexe !== null &&
	            form.value.lieunais !== '' &&
	            form.value.datenais !== null
	        )

	        // return true
	    },

	    '2': () => {
	        return (
	            form.value.telephone1 !== '' &&
	            form.value.adresse !== ''
	        )

	        // return true
	    },

	    '3': () => {
	        if (isAssure.value === 1) {
	            return (
	                form.value.assurance_id !== null &&
	                form.value.numero_assure !== '' &&
	                form.value.taux !== 0
	            )
	        }
	        
	        return true
	    },

	    '4': () => {
		    // Vérifie que toutes les urgences ont tous les champs obligatoires remplis
		    const allFilled = urgences.value.every(u =>
		        u.nom?.trim() !== '' &&
		        u.lien?.trim() !== '' &&
		        u.telephone1?.trim() !== ''
		    )
		    if (!allFilled) return false

		    // // Vérifie s'il y a des numéros de téléphone dupliqués
		    const phones = urgences.value.map(u => u.telephone1.trim())
		    const hasDuplicate = phones.some((p, i) => phones.indexOf(p) !== i)
		    if (hasDuplicate) return false

		    // Si tout est ok, retourne true
		    return true
		},

	    '5': () => {

	        return true
	    },

	    '6': () => true
	}

	const errorMessages = {
	    '1': "Tous les champs sont obligatoires",
	    '2': "Téléphone et adresse requis",
	    '3': "Infos assurance invalides",
	    '4': "Contacts d'urgence incomplets",
	    '5': "Infos médicales requises"
	}

	// --------------------------------------------------------

	const validateStep1 = () => {
	    if (!controls['1']()) {
	        errors.step1 = errorMessages['1']
	        return false
	    }
	    errors.step1 = ''
	    return true
	}

	const validateStep2 = () => {
	    if (!controls['2']()) {
	        errors.step2 = errorMessages['2']
	        return false
	    }
	    errors.step2 = ''
	    return true
	}

	const validateStep3 = () => {
	    if (!controls['3']()) {
	        errors.step3 = errorMessages['3']
	        return false
	    }
	    errors.step3 = ''
	    return true
	}

	const validateStep4 = () => {
	    if (!controls['4']()) {
	        errors.step4 = errorMessages['4']
	        return false
	    }
	    errors.step4 = ''
	    return true
	}

	const validateStep5 = () => {
	    if (!controls['5']()) {
	        errors.step5 = errorMessages['5']
	        return false
	    }
	    errors.step5 = ''
	    return true
	}

	// --------------------------------------------------------

	const rules = {
	    '1': () => controls['1'](),
	    '2': () => controls['2'](),
	    '3': () => controls['3'](),
	    '4': () => controls['4'](),
	    '5': () => controls['5'](),
	    '6': () => controls['6']()
	}

	const isStepValid = (step) => {
	    const stepNumber = Number(step)

	    for (let i = 1; i <= stepNumber ; i++) {
	        const key = String(i)
	        if (!rules[key]?.()) {
	            return false
	        }
	    }

	    return true
	}

	// --------------------------------------------------------

	const stepValidators = {
	    '2': () => validateStep1(),
	    '3': () => validateStep1() && validateStep2(),
	    '4': () => validateStep1() && validateStep2() && validateStep3(),
	    '5': () => validateStep1() && validateStep2() && validateStep3() && validateStep4(),
	    '6': () => validateStep1() && validateStep2() && validateStep3() && validateStep4() && validateStep5()
	}

	const goToStep = (step, activateCallback) => {
	    const validate = stepValidators[step]

	    if (!validate || validate()) {
	        currentStep.value = step
	        activateCallback(step)
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
        { label: 'Masculin', value: 'Masculin' },
        { label: 'Féminin', value: 'Féminin' }
    ]

    const optionAssure = [
        { label: 'Non', value: 0 },
        { label: 'Oui', value: 1 }
    ]

    const assuranceSelectRef = ref(null)
    const assurances = ref([])
    const isAssure = ref(0)
    const loadingSelectAssurance = ref(false)
    const loadingSelectAssuranceRefresh = ref(false)

    const checked = ref(false)
    const loadingForm = ref(false)
    const submitted = ref(false)

    // 🔹 FETCH ASSURANCES
    const fetchAssurances = async (refresh) => {

		if(refresh) {
			
			assuranceSelectRef.value?.hide()
    		await nextTick()
    		assuranceSelectRef.value.filterValue = '';
    		form.value.assurance_id = null
			loadingSelectAssuranceRefresh.value = true
		}

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

	const fetchAntecedents = async (refresh) => {
		if(refresh) {
			
			antecedentSelectRef.value?.hide()
    		await nextTick()
    		antecedentSelectRef.value.filterValue = '';
    		form.value.antecedents = ''
			loadingSelectAntecedentRefresh.value = true
		}

		loadingSelectAntecedent.value = true

	    try {
	        const res = await axios.get('/api/v1/select_antecedents')
	        antecedentsOption.value = res.data.data.map(r => ({
	            label: r.nom,
	            value: r.id
	        }))
	    } catch (e) {
	        showToast('error', 'Erreur', 'Impossible de charger les données')
	    } finally {
	    	loadingSelectAntecedent.value = false
	    	if(refresh) loadingSelectAntecedentRefresh.value = false
	    }
	}

	const fetchAllergies = async (refresh) => {
		if(refresh) {
			
			allergieSelectRef.value?.hide()
    		await nextTick()
    		allergieSelectRef.value.filterValue = '';
    		form.value.allergies = ''
			loadingSelectAllergieRefresh.value = true
		}

		loadingSelectAllergie.value = true

	    try {
	        const res = await axios.get('/api/v1/select_allergies')
	        allergiesOption.value = res.data.data.map(r => ({
	            label: r.nom,
	            value: r.id
	        }))
	    } catch (e) {
	        showToast('error', 'Erreur', 'Impossible de charger les données')
	    } finally {
	    	loadingSelectAllergie.value = false
	    	if(refresh) loadingSelectAllergieRefresh.value = false
	    }
	}

	// Antécédents sélectionnés avec labels
	const antecedentsLabels = computed(() => {
	    if (!form.value.antecedents || form.value.antecedents.length === 0) return '-'
	    return form.value.antecedents
	        .map(id => antecedentsOption.value.find(a => a.value === id)?.label)
	        .filter(Boolean)
	        .join(', ')
	})

	// Allergies sélectionnées avec labels
	const allergiesLabels = computed(() => {
	    if (!form.value.allergies || form.value.allergies.length === 0) return '-'
	    return form.value.allergies
	        .map(id => allergiesOption.value.find(a => a.value === id)?.label)
	        .filter(Boolean)
	        .join(', ')
	})

	const urgencesValides = computed(() => {
	    return urgences.value.filter(u =>
	        u.nom?.trim() !== '' &&
	        u.telephone1?.trim() !== ''
	    )
	})

    const submitForm = async () => {

        if (!checked.value) {
            showToast('warn', 'Alerte', 'Veuillez confirmer les informations')
            return
        }

        loadingForm.value = true

        const payload = {
		    ...form.value,
		    urgences: urgences.value
		}

		console.log(payload)

		return

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
    }
}