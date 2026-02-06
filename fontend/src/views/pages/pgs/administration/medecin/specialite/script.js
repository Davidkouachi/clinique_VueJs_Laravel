import { ref, onMounted, computed,nextTick, watch } from 'vue';
import axios from 'axios';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useToastAlert } from '@/function/function/ToastAlert';
import { usePreloaderSpinner } from '@/function/function/showPreloader';
import { useConfirm } from "primevue/useconfirm";
import { useAuthStore } from '@/function/stores/auth';
import { formaDateHeure } from '@/function/services/format';

export function useScript() {

	const auth = useAuthStore();
	const { showToast } = useToastAlert();
	const preloaderSpinner = usePreloaderSpinner();
	const confirm = useConfirm();

	const lists = ref([]);
	const loading = ref(true);
	const loadingBtn = ref(true);
	const filters = ref({});
	const showModal = ref(false);
	const listSelected = ref({});
	const globalFilter = ref('');
	const dt = ref(null);
	const menuRefs = ref({});
	const selectedLists = ref([]);

	// ------------------------ filtre et api -----------------------------

	function initFilters() {

	    filters.value = {
	        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
	        nom: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
	    };
	}

	const fetchLists = async (loaderBtn = false, callback) => {
	    loading.value = true;
	    loadingBtn.value = loaderBtn;

	    // Placeholder pendant le chargement
	    lists.value = new Array(10).fill({});

	    try {
	        const res = await axios.get('/api/v1/api_get_specialite');

	        // Vérifie si la réponse est vide ou status 204
	        const data = res.data?.data ?? [];

	        if (!data.length) {
	            lists.value = [];
	            showToast('info', 'Info', 'Aucune données trouver.');
	        } else {
	            // Mappe chaque processus pour cloner l'objet et conserver la structure
	            lists.value = data.map(item => ({
	                ...item,
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

	const actionItems = (data) => {
		const items = [];

	    // 👉 Actions UNIQUEMENT si compte actif
	    if (data.statut === 1) {
	        items.push(
	            {
	                label: 'Modifier',
	                icon: 'pi pi-pencil',
	                command: () => updateTable(data)
	            },
	            {
	                label: 'Désactiver',
	                icon: 'pi pi-lock',
	                command: () => showToast('warn', 'Désactiver', `Désactiver ${data.nom}`)
	            },
	        );
	    }

	    // 👉 Actions UNIQUEMENT si compte verrouillé
	    if (data.statut !== 1) {
	        items.push({
	            label: 'Activer',
	            icon: 'pi pi-unlock',
	            command: () => showToast('success', 'Activer', `Activer ${data.nom}`)
	        });
	    }

	    return items;
	};


	// ------------------------ ajouter & modifier une ligne -----------------------------

	const insertTable = () => {
	    editMode.value = false;
	    editId.value = null;

	    name.value = '';

	    checked.value = false;

	    showEditModal.value = true;
	};

	const updateTable = (data) => {
	    editMode.value = true;
	    editId.value = data.id;

	    name.value = data.nom;

	    checked.value = false;

	    showEditModal.value = true;
	};

	// ------------------------ ajouter & supprimer une ligne -----------------------------

	const formSubmit = async () => {

	    if (!name.value) {
	        showToast('warn', 'Alerte', 'Formulaire incomplet')
	        return
	    }

	    if (!checked.value) {
	        showToast('warn', 'Alerte', 'Veuillez confirmer les informations');
	        return;
	    }

	    loadingForm.value = true;

	    try {
	        const payload = {
	            nom: name.value,
	        };

	        let res;

	        if (editMode.value) {
	            // UPDATE
	            res = await axios.put(
	                `/api/v1/api_update_specialite/${editId.value}`,
	                payload
	            );
	        } else {
	            // INSERT
	            res = await axios.post(
	                `/api/v1/api_insert_specialite`,
	                payload
	            );
	        }

	        if (res.status === 200) {
	            showToast('success', 'Succès', res.data.msg);
	            fetchLists();
	            showEditModal.value = false;
	        } else if (res.status === 201) {
	            showToast('info', 'Alerte', res.data.msg);
	        } else {
	            showToast('warn', 'Alerte', res.data.msg);
	        }

	    } catch (err) {
	        showToast('error', 'Erreur', err.response?.data?.msg || 'Erreur serveur');
	    } finally {
	        loadingForm.value = false;
	    }
	};

	// ------------------------ supprimer une ligne -----------------------------

	const confirmStatut = (event, id, mode) => {
	    confirm.require({
	        target: event?.currentTarget,
	        message: `Voulez-vous vraiment continuer ?`,
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
	                'Suppression en cours...',
	                async () => {
	                    try {
	                        await statutList(id, mode)
	                    } finally {
	                        preloaderSpinner.hideSpiner()
	                    }
	                },
	                'rgba(255,255,255,0.9)'
	            )
	        }
	    })
	}

	async function statutList(id, mode) {

	    try {
	    	console.log(id)
	    	console.log(mode)
	        const res = await axios.put(`/api/v1/api_statut_specialite/${id}/${mode}`)

	        if (res.status === 200) {
	      
	            selectedLists.value = []
	            await fetchLists(
	            	false,
	            	showToast(
		                'success',
		                'Succès',
		                `Opération éffectuée`
		            )
		        )
	        } else {
	            showToast('warn', 'Attention', res.data.msg)
	        }

	    } catch (err) {
	        showToast('error', 'Erreur', err.response?.data?.msg || 'Erreur serveur')
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
	    lists.value.filter(u =>
	        u.statut === 1
	    )
	);

	// ------------------------ Mise à jour -----------------------------

	const showEditModal = ref(false);
	const editMode = ref(false);
	const editId = ref(null);

	const name = ref('')
	const checked = ref(false);
	const loadingForm = ref(false);

	return {
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
	};


}   