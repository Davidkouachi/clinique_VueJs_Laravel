import { ref, onMounted, computed,nextTick, watch, markRaw } from 'vue';
import axios from 'axios';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useToastAlert } from '@/function/function/ToastAlert';
import { usePreloaderSpinner } from '@/function/function/showPreloader';
import { useConfirm } from "primevue/useconfirm";
import { useAuthStore } from '@/function/stores/auth';
import { formaDateHeure } from '@/function/services/format';
import { onlyNumbers, onlyUppercase } from '@/function/format';
import viewOption from './viewOption.vue'
import updateOption from './updateOption.vue'
import { useDrawerStore } from '@/function/stores/drawer'

export function useScript() {

	const drawerComponent = ref(null)

	const auth = useAuthStore();
	const { showToast } = useToastAlert();
	const preloaderSpinner = usePreloaderSpinner();
	const confirm = useConfirm();
	const drawerUse = useDrawerStore();

	const lists = ref([]);
	const loading = ref(true);
	const loadingBtn = ref(true);
	const filters = ref({});
	const showModal = ref(false);
	const showModalView = ref(false);
	const listSelected = ref({});
	const globalFilter = ref('');
	const dt = ref(null);
	const menuRefs = ref({});
	const selectedLists = ref([]);

	// ------------------------ filtre et api -----------------------------

	function initFilters() {
	    filters.value = {
	        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
	    };
	}

	const fetchLists = async (loaderBtn = false, callback) => {
	    loading.value = true;
	    loadingBtn.value = loaderBtn;

	    // Placeholder pendant le chargement
	    lists.value = new Array(10).fill({});

	    try {
	        const res = await axios.get('/api/v1/api_get_medecin');

	        // Vérifie si la réponse est vide ou status 204
	        const data = res.data?.data ?? [];

	        if (!data.length) {
	            lists.value = [];
	            showToast('info', 'Info', 'Aucune données trouver.');
	        } else {
	            // Mappe chaque processus pour cloner l'objet et conserver la structure
	            lists.value = data.map(item => ({
	                ...item,
	                statut_label: item.statut === 1 ? 'Actif' : 'Inactif'
	            }));
	        }

	    } catch (err) {
	        console.error('Erreur API:', err);
	        lists.value = [];
	        showToast('error', 'Erreur', 'Impossible de charger les processus.');
	    } finally {
	        loading.value = false;
	        loadingBtn.value = false;

	        // ⚡ Appelle le callback si défini
	        if (typeof callback === 'function') {
	            callback();
	        }

	        await nextTick();
	        initFilters(false);
	    }
	};

	// ------------------------ boutton pour imprimer-----------------------------

	const rowsPerPage = ref(10);
	const currentPage = ref(1);
	const totalRows = computed(() => lists.value.length);

	function onPage(event) {
	    currentPage.value = event.page + 1;
	    rowsPerPage.value = event.rows;   // <<< SUPER IMPORTANT
	}

	const totalPages = computed(() => {
	    return lists.value.length && rowsPerPage.value
	        ? Math.ceil(lists.value.length / rowsPerPage.value)
	        : 1;
	});

	const rowClass = (data) => {
	    // 1. Pendant le chargement du tableau → aucune couleur
	    if (loading.value) {
	        return '';
	    }
	};

	const getLignesPageCourante = () => {
	    if (!dt.value) return [];

	    // processedData contient EXACTEMENT les lignes affichées dans le tableau
	    const visible = dt.value.processedData;

	    return visible ?? [];
	};

	// ------------------------ ajouter & modifier une ligne -----------------------------
	const BtnfoterView = [
	    {   
	        id: 'logout',
	        label: 'Fermer',
	        icon: 'pi pi-times',
	        variant: 'outlined',
	        severity: 'danger',
	        command: () => {
	            drawerUse.hide();
	        }
	    }
	];

	function viewTable(data) {
	  drawerUse.show(
	    "Détails du médecin",
	    "",
	    "right",
	    "30rem",
	    markRaw(viewOption),
	    { data: data },
    	{ footerBtn: BtnfoterView }
	  );
	}

	const updateTable = (data) => {

	  	drawerUse.show(
	    	"Mise à jour",
	    	"pi pi-pencil",
	    	"right",
	    	"50rem",
	    	markRaw(updateOption),
	    	{ 
	    		data: data,
	    		fetchLists
    		},
	  	)
	}

	// ------------------------ ajouter & supprimer une ligne -----------------------------

	// const formSubmit = async () => {

	//     submitted.value = true

	//     if (
	//         !nom.value ||
	//         !prenom.value ||
	//         !email.value ||
	//         !telephone.value ||
	//         !titre_id.value ||
	//         !specialite_id.value
	//     ) {
	//         showToast('warn', 'Alerte', 'Veuillez remplir tous les champs obligatoires')
	//         return
	//     }

	//     if (!checked.value) {
	//         showToast('warn', 'Alerte', 'Veuillez confirmer les informations')
	//         return
	//     }

	//     const payload = {
	//         nom: nom.value,
	//         prenom: prenom.value,
	//         email: email.value,
	//         telephone: telephone.value,
	//         titre_id: titre_id.value,
	//         specialite_id: specialite_id.value,
	//         numero_ordre: numero_ordre.value || null,
	//         ajouterAcces: ajouterAcces.value
	//     }

	//     if (ajouterAcces.value) {
	//         payload.login = login.value
	//         payload.password = password.value
	//     }

	//     loadingForm.value = true

	//     try {

	//         const url = `/api/v1/api_update_medecins/${editUid.value}`

	//         const res = await axios.put(url, payload)

	//         if (res.status === 200) {
	//             fetchLists()
	//             showToast('success', 'Succès', res.data.msg)
	//             showModal.value = false
	//             resetForm()
	//         } else {
	//         	showToast('warn', 'Attention', res.data.msg)
	//         }

	//     } catch (err) {
	//         showToast(
	//             'error',
	//             'Erreur',
	//             err.response?.data?.msg || 'Erreur serveur'
	//         )
	//     } finally {
	//         loadingForm.value = false
	//     }
	// }

	const formSubmit = async (payload) => {

	    if (
	        !payload.nom ||
	        !payload.prenom ||
	        !payload.email ||
	        !payload.telephone ||
	        !payload.titre_id ||
	        !payload.specialite_id
	    ) {
	        showToast('warn', 'Alerte', 'Veuillez remplir tous les champs obligatoires')
	        return
	    }

	    if (ajouterAcces.value) {

		    if (!payload.login) {
		        showToast('warn', 'Alerte', 'Le login est obligatoire') 
		        return
		    } 

		    if (!payload.cpassword || payload.password) { 

		    	if ( !isPasswordValid(payload.password) || !isPasswordValid(payload.cpassword) ) { 

		    		showToast( 
		    			'warn', 
		    			'Mot de passe invalide', 
		    			'Min 8 caractères, majuscule, minuscule et chiffre' 
		    		) 
		    		return 
		    	} 

		    	if (payload.password !== payload.cpassword) { 

		    		showToast( 
		    			'warn', 
		    			'Mot de passe incorrect', 
		    			'Les mots de passe ne correspondent pas' 
		    		) 
		    		return 
		    	} 
		    } 
		}

	    if (!payload.checked) {
	        showToast('warn', 'Alerte', 'Veuillez confirmer les informations')
	        return
	    }

	    loadingForm.value = true

	    try {

	        const url = `/api/v1/api_update_medecins/${editUid.value}`

	        const res = await axios.put(url, payload)

	        if (res.status === 200) {
	            fetchLists()
	            showToast('success', 'Succès', res.data.msg)
	            drawerUse.hide()
	        } else {
	            showToast('warn', 'Attention', res.data.msg)
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

	const changeStatut = async (uid, statut) => {

		preloaderSpinner.showSpiner(
            'Opération en cours ...', 
            async () => { 
                
                try {

			        const res = await axios.put(
			            `/api/v1/api_statut_medecins/${uid}/${statut}`
			        )

			        if (res.status === 200) {

			            fetchLists()
			            showToast('success', 'Succès', res.data.msg)

			        } else {

			        	showToast('warn', 'Attention', res.data.msg)
			        }

			    } catch (err) {

			        showToast(
			            'error',
			            'Erreur',
			            err.response?.data?.msg || 'Erreur serveur'
			        )
			    } finally {

                  	preloaderSpinner.hideSpiner();
                }
            }, 
            'rgba(255,255,255,0.9)'
        );
	}

	// ------------------------ supprimer une ligne -----------------------------

	const deleteTable = (event, data) => {
	    confirm.require({
	        target: event.currentTarget,
	        message: 'Voulez-vous continuer ?',
	        icon: 'pi pi-info-circle',
	        rejectProps: {
	            label: 'Non',
	            severity: 'danger',
	            outlined: true
	        },
	        acceptProps: {
	            label: 'Oui',
	            severity: 'success'
	        },
	        accept: async () => {

	            preloaderSpinner.showSpiner(
	                'Opération en cours...', 
	                async () => { 
	                    try {
                      		await deletList(data.id);
	                    } catch (error) {
	                      	console.error(error);
	                    } finally {
	                      	preloaderSpinner.hideSpiner();
	                    }
	                }
	                , 
	                'rgba(255,255,255,0.9)'
	            );
	        },
	        reject: () => {
	            // showToast('info', 'Alerte', 'Opération non éffectuée.');
	        }
	    });
	};

	async function deletList(id) {
	    try {
	        const response = await axios.delete('/api/v1/api_delete_roles/' + id);
	        const data = response.data;

	        preloaderSpinner.hideSpiner();

	        if (response.status === 200) {

	            preloaderSpinner.showSpiner(
	                'Opération terminée, actualisation des données...', 
	                async () => { 
	                    
	                    try {
                      		await fetchLists(
		                        false, 
		                        () => {
		                            preloaderSpinner.hideSpiner();
		                            showToast('success', 'Succès', 'Opération éffectuée');
		                        }
		                    );
	                    } catch (error) {
	                      	console.error(error);
	                    } finally {
	                      	preloaderSpinner.hideSpiner();
	                    }
	                }, 
	                'rgba(255,255,255,0.9)'
	            );

	        } else if (response.status === 201) {
	            showToast('info', 'Informations', data.msg);
	        } else {
	            showToast('warn', 'Attention', data.msg);
	        }
	    } catch (err) {
	        showToast('error', 'Erreur', err.msg || 'Erreur inattendue');
	    }
	}

	// ------------------------ selection des lignes du tableau -----------------------------

	const showSelected = () => {
	    const before = JSON.parse(JSON.stringify(selectedLists.value));
	    showToast('info', 'Sélection', before.length + ' ligne(s) sélectionnée(s)');
	};

	const isSelected = (row) => {
	    return selectedLists.value.some(u => u.id === row.id);
	};

	const isAllSelected = computed(() => {
	    if (!selectableRows.value.length) return false;

	    return selectableRows.value.every(u => isSelected(u));
	});

	const toggleRow = (checked, row) => {
	    if (checked) {
	        if (!isSelected(row)) {
	            selectedLists.value.push({ ...row });
	        }
	    } else {
	        selectedLists.value = selectedLists.value.filter(u => u.id !== row.id);
	    }
	};

	const toggleAll = (check) => {
	    if (check && selectableRows.value.length === 0) {
	        // Rien à sélectionner → on force décoché
	        return;
	    }

	    if (check) {
	        selectedLists.value = selectableRows.value.map(u => ({ ...u }));
	    } else {
	        selectedLists.value = [];
	    }

	    showToast(
	        'info',
	        'Sélection',
	        check
	            ? `${selectedLists.value.length} ligne(s) sélectionnée(s)`
	            : 'Sélection annulée'
	    );
	};

	const selectableRows = computed(() =>
	    lists.value
	);

	// ------------------------ verification -----------------------------

	const isPasswordValid = (pw = '') => {
	    return (
	        pw.length >= 8 &&
	        /[a-z]/.test(pw) &&
	        /[A-Z]/.test(pw) &&
	        /\d/.test(pw)
	    )
	}	

	return {
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
	};

}