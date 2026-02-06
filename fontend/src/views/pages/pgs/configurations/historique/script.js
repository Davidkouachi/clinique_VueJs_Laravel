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
	        action: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
	        model: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
	        description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
	        ip_address: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
	        created_at: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
	    };
	}

	const fetchLists = async (loaderBtn = false, callback) => {
	    loading.value = true;
	    loadingBtn.value = loaderBtn;

	    // Placeholder pendant le chargement
	    lists.value = new Array(10).fill({});

	    try {
	        const res = await axios.get('/api/v1/api_get_activity');

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

	function viewTable (data) {
	    listSelected.value = data;
	    showModal.value = true;
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

	return {
		fetchLists,

		// ------------------ function
		viewTable,

		// ------------------ modal
        showModal,
        listSelected,

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

	    // ------------------ Filtres & table
	    initFilters,
	    onPage,
	    rowClass,

	    // ------------------ Utils
	    formaDateHeure
	};


}