<template>
    <div class="flex flex-col" ref="productTop">

        <Toolbar v-if="firstLoad" class="!bg-orange-500">
            <template #start>
                <div class="flex justify-center items-center">
                    <div class="font-bold text-2xl text-white">Produits</div>
                </div>
            </template>

            <template #center>
                <div class="flex justify-center items-center">
                    <SelectButton 
                        v-model="layout" 
                        :options="options" 
                        :allowEmpty="false"
                    >
                        <template #option="{ option }">
                            <i :class="[option === 'list' ? 'pi pi-list' : 'pi pi-th-large']" />
                        </template>
                    </SelectButton>
                </div>
            </template>

            <template #end>
                <div class="flex justify-center items-center bg-surface-0 rounded-full">
                    <Button
                        type="button" 
                        icon="pi pi-search" 
                        label="" 
                        @click="openDrawerRech()" 
                        severity="warn"
                        variant="text"
                    />
                </div>
            </template>
        </Toolbar>
        
        <div v-if="loading" class="flex flex-col gap-4">
            <!-- GRID Skeleton -->
            <div v-if="layout === 'grid'">
                <div class="grid grid-cols-12 gap-2">
                    <div v-for="i in 20" :key="i" class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-4 xl:col-span-2 p-2">
                        <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded">
                            <div class="flex flex-wrap items-center justify-between gap-2">
                                <Skeleton width="6rem" height="2rem" />
                                <Skeleton width="3rem" height="1rem" />
                            </div>
                            <div class="flex flex-col items-center gap-4 py-8">
                                <Skeleton width="75%" height="10rem" />
                                <Skeleton width="8rem" height="2rem" />
                                <Skeleton width="6rem" height="1rem" />
                            </div>
                            <div class="flex items-center justify-between">
                                <Skeleton width="4rem" height="2rem" />
                                <Skeleton width="6rem" height="1rem" shape="circle" size="3rem" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- LIST Skeleton -->
            <div v-else>
                <div class="flex flex-col">
                    <div v-for="i in 6" :key="i">
                        <div class="flex flex-col xl:flex-row xl:items-start p-6 gap-6" :class="{ 'border-t border-surface-200 dark:border-surface-700': i !== 0 }">
                            <Skeleton class="!w-9/12 sm:!w-64 xl:!w-40 !h-24 mx-auto" />
                            <div class="flex flex-col sm:flex-row justify-between items-center xl:items-start flex-1 gap-6">
                                <div class="flex flex-col items-center sm:items-start gap-4">
                                    <Skeleton width="8rem" height="2rem" />
                                    <Skeleton width="6rem" height="1rem" />
                                    <div class="flex items-center gap-4">
                                        <Skeleton width="6rem" height="1rem" />
                                        <Skeleton width="3rem" height="1rem" />
                                    </div>
                                </div>
                                <div class="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2">
                                    <Skeleton width="4rem" height="2rem" />
                                    <Skeleton size="3rem" shape="circle" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <DataView 
            v-else 
            :value="products"
            :layout="layout" 
            :emptyMessage="''" 
            :pt="{
                content: { class: '!bg-transparent' },
                root: { class: '!bg-transparent border-none' }
            }">

            <!-- <template #header>

            </template> -->

            <template #grid="slotProps">
                <div class="grid grid-cols-12 gap-1 mt-3 p-0">
                    <div v-for="(item, index) in slotProps.items || []" :key="index" class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-4 xl:col-span-2 p-2" >
                        <div class="p-3 border border-surface-0 dark:border-surface-900 bg-surface-0 dark:bg-surface-900 rounded flex flex-col h-full">
                            <div class="bg-surface-50 flex justify-center rounded p-0 border-[0.1rem]">
                                <div class="relative w-full h-55">
                                    <img
                                        :id="`product-image-${item.id}`"
                                        class="w-full h-full object-cover"
                                        imageClass="w-full h-full object-cover"
                                        :src="`https://primefaces.org/cdn/primevue/images/product/${item.img}`"
                                        :alt="item.nom"
                                    />
                                    <Tag
                                        v-if="item.qte >= 0"
                                        :value="getStockInfo(item).label"
                                        :class="['absolute border-none !text-white',getStockInfo(item).class]"
                                        style="left: 4px; top: 4px"
                                    />
                                    <div class="absolute bg-surface-100 p-0 rounded-[5rem]" style="right: 4px; top: 4px">
                                        <div class="flex items-center justify-center gap-2 justify-center py-1 px-2">
                                            <span class="text-surface-900 font-medium text-[0.9rem]">
                                                {{ item.eval }}
                                            </span>
                                            <i class="pi pi-star-fill text-yellow-500"></i>
                                        </div>
                                    </div>
                                    <div class="absolute p-1 rounded-[5rem]"
                                        style="right: 4px; top: 30px"
                                        :class="item.livraison == 1 ? 'bg-green-500' : 'bg-red-500'">
                                        <div class="flex items-center justify-center gap-2 p-1">
                                            <i class="pi pi-truck" :class="item.livraison == 1 ? 'text-white' : 'text-white'"></i>
                                        </div>
                                    </div>
                                    <div class="absolute flex justify-center w-14 h-14 rounded-full border-[0.1rem]"
                                      :style="{
                                        right: '10px',
                                        bottom: '-25px',
                                        backgroundImage: `url(https://primefaces.org/cdn/primevue/images/product/${item.img})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                      }"
                                    >
                                    </div>
                                </div>
                            </div>
                            <div class="pt-6 flex flex-col flex-1">
                                <div class="flex flex-row justify-between items-start gap-2 mb-1">
                                    <div class="flex-1">
                                        <span class="font-medium text-surface-500 dark:text-surface-400 text-sm" >
                                            {{ item.category }}
                                        </span>

                                        <div class="text-md font-medium mt-1 line-clamp-1 break-words mt-auto">
                                            {{ item.nom }}
                                        </div>
                                    </div>
                                </div>

                                <div class="flex flex-col items-start gap-0 mt-auto mb-0">

                                    <!-- Si réduction existe -->
                                    <template v-if="item.prixReduc">

                                        <!-- Nouveau prix -->
                                        <span class="text-lg font-bold text-red-600">
                                            {{ formatXOF(item.prixReduc) }}
                                        </span>

                                        <!-- Ancien prix barré -->
                                        <div class="flex items-center gap-2">
                                            <span class="text-sm line-through text-blue-800">
                                                {{ formatXOF(item.prix) }}
                                            </span>
                                            <Badge
                                                v-if="getDiscountPercent(item) > 0"
                                                :value="`-${getDiscountPercent(item)}%`"
                                                size="large"
                                                :severity="getDiscountSeverity(getDiscountPercent(item))"
                                            />
                                        </div>

                                    </template>

                                    <!-- Sinon prix normal -->
                                    <template v-else>
                                        <span class="text-lg font-bold text-blue-800">
                                            {{ formatXOF(item.prix) }}
                                        </span>
                                    </template>

                                </div>
                                
                                <div class="flex flex-col gap-2 mt-auto">

                                    <div class="flex flex-col items-start gap-0 mt-0 mb-0">

                                        <!-- <span class="text-sm text-gray-600">
                                            Livraison rapide garantie sous 3 jours ouvrables
                                        </span> -->

                                    </div>

                                    <div class="flex gap-2">
                                        <Button
                                            :severity="item.qte === 0 ? `danger` : `success`"
                                            :icon="item.qte === 0 ? `pi pi-cart-minus` : `pi pi-shopping-cart`"
                                            :label="item.qte === 0 ? `indisponible` : `Ajouter`"
                                            :disabled="item.qte === 0"
                                            class="flex-auto whitespace-nowrap"
                                            @click="addToCart(item)"
                                        />
                                        <Button
                                            label=""
                                            severity="warn"
                                            icon="pi pi-eye"
                                            @click="openDrawerView(item)"
                                        />
                                        <Button
                                            :icon="toggleFavorite.check(item.id) ? 'pi pi-heart-fill' : 'pi pi-heart'"
                                            variant="outlined"
                                            :outlined="!toggleFavorite.check(item.id)"
                                            class="favorite-btn"
                                            @click="toggleFavorite.toggle(item.id)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </template>

            <template #list="slotProps">
                <div class="flex flex-col mt-2">
                    <div v-for="(item, index) in slotProps.items || []" :key="index">
                        <div class="flex flex-col md:flex-row md:items-center p-2 gap-4 bg-surface-0 dark:bg-surface-900 rounded my-2" :class="{ 'border-t border-surface': index !== 0 }">
                            <div class="md:w-40 relative border-[0.1rem]">
                                <img
                                    :id="`product-image-${item.id}`"
                                    class="block xl:block mx-auto rounded w-full" 
                                    :src="`https://primefaces.org/cdn/primevue/images/product/${item.img}`" 
                                    :alt="item.nom" />
                                <div class="absolute p-1 rounded-[5rem]"
                                    style="left: 4px; top: 4px"
                                    :class="item.livraison == 1 ? 'bg-green-500' : 'bg-red-500'">
                                    <div class="flex items-center justify-center gap-2 p-1">
                                        <i class="pi pi-truck" :class="item.livraison == 1 ? 'text-white' : 'text-white'"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-2">
                                <div class="flex flex-row md:flex-col justify-between items-start gap-1">
                                    <div>
                                        <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.category }}</span>
                                        <div class="text-lg font-medium mt-1">{{ item.nom }}</div>
                                    </div>
                                    <div class="flex flex-row justify-center items-left gap-1 mt-1">
                                        <div class="bg-surface-0 flex items-center justify-center gap-2 justify-center py-1 px-2 text-[0.9rem] border-[0.1rem] border-yellow-500 rounded-[0.5rem]">
                                            <span class="text-surface-900 font-medium ">{{ item.eval }}</span>
                                            <i class="pi pi-star-fill text-yellow-500"></i>
                                        </div>
                                        <Tag
                                            v-if="item.qte >= 0"
                                            :value="getStockInfo(item).label"
                                            :class="[
                                                'border-none !text-white !text-[0.9rem]',
                                                getStockInfo(item).class
                                            ]"
                                        />
                                    </div>
                                </div>
                                <div class="flex flex-col md:items-end gap-8">
                                    <div class="flex flex-col items-start gap-0 mt-auto mb-0">

                                        <!-- Si réduction existe -->
                                        <template v-if="item.prixReduc">

                                            <!-- Nouveau prix -->
                                            <span class="text-lg font-bold text-red-600">
                                                {{ formatXOF(item.prixReduc) }}
                                            </span>

                                            <!-- Ancien prix barré -->
                                            <div class="flex items-center gap-2">
                                                <span class="text-sm line-through text-blue-800">
                                                    {{ formatXOF(item.prix) }}
                                                </span>
                                                <Badge
                                                    v-if="getDiscountPercent(item) > 0"
                                                    :value="`-${getDiscountPercent(item)}%`"
                                                    size="large"
                                                    :severity="getDiscountSeverity(getDiscountPercent(item))"
                                                />
                                            </div>

                                        </template>

                                        <!-- Sinon prix normal -->
                                        <template v-else>
                                            <span class="text-lg font-bold text-blue-800">
                                                {{ formatXOF(item.prix) }}
                                            </span>
                                        </template>

                                    </div>
                                    <div class="flex flex-row-reverse md:flex-row gap-2">
                                        <Button
                                            :icon="toggleFavorite.check(item.id) ? 'pi pi-heart-fill' : 'pi pi-heart'"
                                            variant="outlined"
                                            :outlined="!toggleFavorite.check(item.id)"
                                            class="favorite-btn"
                                            @click="toggleFavorite.toggle(item.id)"
                                        />
                                        <Button
                                            label=""
                                            severity="warn"
                                            icon="pi pi-eye" 
                                        />
                                        <Button
                                            :severity="item.qte === 0 ? `danger` : `success`"
                                            :icon="item.qte === 0 ? `pi pi-cart-minus` : `pi pi-shopping-cart`"
                                            :label="item.qte === 0 ? `indisponible` : `Ajouter`"
                                            :disabled="item.qte === 0"
                                            class="flex-auto whitespace-nowrap"
                                            @click="addToCart(item)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <template #empty>
                <div class="px-3 py-2 mt-6 rounded-[0.5rem] bg-surface-0 dark:bg-surface-900 flex flex-col gap-3 w-full justify-center items-center">
                    <div class="flex justify-center items-center">
                        <div class="font-bold text-lg text-red-600">
                            Aucun produit n'a été trouver
                        </div>
                    </div>
                    <div class="flex justify-center items-center">
                        <Button 
                            type="button" 
                            icon="pi pi-refresh" 
                            label="Réinitialiser" 
                            @click="reloadloadProducts()" 
                            severity="warn"
                        />
                    </div>
                </div>
            </template>

        </DataView>

        <!-- Pagination -->
        <!-- <div v-if="totalPages > 1" class="flex justify-center gap-2 py-6">
            <button 
                class="px-4 py-2 border rounded disabled:opacity-50"
                :disabled="currentPage === 1"
                @click="goToPage(currentPage - 1)">
                Précédent
            </button>

            <span class="px-4 py-2">Page {{ currentPage }} / {{ totalPages }}</span>

            <button 
                class="px-4 py-2 border rounded disabled:opacity-50"
                :disabled="currentPage === totalPages"
                @click="goToPage(currentPage + 1)">
                Suivant
            </button>
        </div> -->

        <Paginator
            :rows="limit"
            :totalRecords="totalProducts"
            :first="first"
            @page="onPageChange"
            :rowsPerPageOptions="[18, 36, 54]"
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            class="mt-6"
        />

    </div>
</template>

<script setup>
import { ProductService } from '@/service/ProductList';
import { ref, computed, onMounted, watch, markRaw } from 'vue';
import { useDrawerStore } from '@/function/stores/drawer'
import rechOption from './produitRech.vue'
import viewOption from './produitView.vue'

const drawerUse = useDrawerStore();

// --- Références
const productTop = ref(null);
const products = ref([]);
const layout = ref('grid');
const options = ref(['grid', 'list']);

const limit = 54;  
const currentPage = ref(1);
const totalProducts = ref(0);
const loading = ref(false);
const firstLoad = ref(false);

const searchQuery = ref('');
const minPrix = ref(0)    // prix min
const maxPrix = ref(1000000) // prix max par défaut
const selectedLivraison = ref(0);
const livraisonOptions = ref([
    { label: 'Tous', value: 0 },
    { label: 'Gratuite', value: 1 },
    { label: 'Payante', value: 2 },
]);

const selectedCategory = ref(0);
const categoryOptions = ref([
    { label: 'Tous', value: 0 },
    { label: 'Accessories', value: 1 },
    { label: 'Shoes', value: 2 },
    { label: 'Fashion', value: 3 },
    { label: 'Electronics', value: 4 },
    { label: 'Informatique', value: 5 },
    { label: 'Hommes', value: 6 },
]);

const selectedStock = ref(0);
const stockOptions = ref([
    { label: 'Tous', value: 0 },
    { label: 'En stock', value: 1 },
    { label: 'Stock faible', value: 2 },
    { label: 'Rupture', value: 3 },
]);

const cartIcon = ref(null)
const addToCart = (item) => {

  const cartIcon = document.querySelector('#global-cart-icon')
  if (!cartIcon) return

  const productImage = document.querySelector(`#product-image-${item.id}`)
  if (!productImage) return

  const start = productImage.getBoundingClientRect()
  const end = cartIcon.getBoundingClientRect()

  const img = document.createElement('img')
  img.src = productImage.src
  img.className = 'flying-item'

  // 🔥 départ centre image
  img.style.left = `${start.left + start.width / 2}px`
  img.style.top = `${start.top + start.height / 2}px`
  img.style.transform = 'translate(-50%, -50%)'

  img.style.width = '50px'
  img.style.height = '50px'
  img.style.border = '1px solid white'
  img.style.borderRadius = '50%'
  img.style.objectFit = 'cover'
  img.style.position = 'fixed'
  img.style.transition = 'all 0.8s cubic-bezier(.22,1,.36,1)'
  img.style.zIndex = '9999'

  document.body.appendChild(img)

  setTimeout(() => {
    img.style.left = `${end.left + end.width / 2}px`
    img.style.top = `${end.top + end.height / 2}px`
    img.style.width = '20px'
    img.style.height = '20px'
    img.style.opacity = '0.5'
  }, 200)

  setTimeout(() => {
    img.remove()
  }, 900)
}

// On transforme toggleFavorite en objet
const toggleFavorite = (() => {
    const favorites = ref(new Set())

    return {
        // toggle un item
        toggle(itemId) {
            if (favorites.value.has(itemId)) {
                favorites.value.delete(itemId)
            } else {
                favorites.value.add(itemId)
            }
        },
        // vérifier si c'est favori
        check(itemId) {
            return favorites.value.has(itemId)
        },
        // ajouter un favori
        add(itemId) {
            favorites.value.add(itemId)
        },
        // supprimer un favori
        remove(itemId) {
            favorites.value.delete(itemId)
        },
        // exposer la liste complète si besoin
        all() {
            return favorites.value
        }
    }
})()

// --- Charger les produits pour une page
const loadProducts = async (page = 1, filters = {}) => {
    loading.value = true;

    const offset = (page - 1) * limit;

    const result = await ProductService.getProductsPaginated(
        offset,
        limit,
        filters // 🔥 passer tout l'objet filtre
    );

    products.value = result.products;
    totalProducts.value = result.total;
    
    loading.value = false;
    firstLoad.value = true;
    currentPage.value = page;
};

function reloadloadProducts() {
    searchQuery.value = ''
    selectedCategory.value = 0
    layout.value = 'grid'
    minPrix.value = 0
    maxPrix.value = 1000000
    selectedLivraison.value = 0
    selectedStock.value = 0

    loadProducts(1, {
        searchQuery: searchQuery.value,
        selectedCategory: selectedCategory.value,
        layout: layout.value,
        minPrix: minPrix.value,
        maxPrix: maxPrix.value,
        livraison: selectedLivraison.value,
        stock: selectedStock.value,
    });
}

// --- Pagination
const totalPages = computed(() => Math.ceil(totalProducts.value / limit));
const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return;

    loadProducts(page, {
        searchQuery: searchQuery.value,
        selectedCategory: selectedCategory.value,
        minPrix: minPrix.value,
        maxPrix: maxPrix.value,
        livraison: selectedLivraison.value,
        stock: selectedStock.value,
    });

    scrollToTop();
};

const first = ref(0) // index du premier élément
const onPageChange = (event) => {

    first.value = event.first
    currentPage.value = event.page + 1

    loadProducts(currentPage.value, {
        searchQuery: searchQuery.value,
        selectedCategory: selectedCategory.value,
        minPrix: minPrix.value,
        maxPrix: maxPrix.value,
        livraison: selectedLivraison.value,
        stock: selectedStock.value,
    });

    scrollToTop();
}

// ------------------------ ajouter & modifier une ligne -----------------------------
const getFooterButtons = () => [
  {
    id: 'logout',
    label: 'Fermer',
    icon: 'pi pi-times',
    variant: 'outlined',
    severity: 'danger',
    command: () => drawerUse.hide()
  },
  {
    id: 'DrawerBtn',
    label: 'Réinitialiser',
    icon: 'pi pi-refresh',
    severity: 'warn',
    command: () => drawerUse.callComponentMethod('reset')
  },
  {
    id: 'DrawerBtn',
    label: 'Valider',
    icon: 'pi pi-check',
    severity: 'primary',
    command: () => drawerUse.callComponentMethod('submit')
  }
]

const openDrawerRech = () => {

  drawerUse.show(
    "Recherche",
    "pi pi-search",
    "right",
    "30rem",
    markRaw(rechOption),
    {
      searchQuery,
      minPrix,
      maxPrix,
      selectedLivraison,
      selectedCategory,
      selectedStock,
      layout,
      categoryOptions: () => categoryOptions.value,
      livraisonOptions: () => livraisonOptions.value,
      stockOptions: () => stockOptions.value,
      applyFilters: ({ 
        searchQuery: newSearch, 
        selectedCategory: newCategory, 
        layout: newLayout, 
        minPrix: newMinPrix, 
        maxPrix: newMaxPrix, 
        selectedLivraison: newSelectedLivraison,
        selectedStock: newSelectedStock }) => {
            // 🔹 mettre à jour les refs
            searchQuery.value = newSearch;
            selectedCategory.value = newCategory;
            layout.value = newLayout;
            minPrix.value = newMinPrix;
            maxPrix.value = newMaxPrix;
            selectedLivraison.value = newSelectedLivraison;
            selectedStock.value = newSelectedStock;

            // 🔹 reset pagination
            currentPage.value = 1;

            // 🔹 appeler loadProducts avec toutes les infos
            loadProducts(1, {
                searchQuery: newSearch,
                selectedCategory: newCategory,
                layout: newLayout,
                minPrix: newMinPrix,
                maxPrix: newMaxPrix,
                livraison: newSelectedLivraison,
                stock: newSelectedStock,
            });
        },
        reloadloadProducts
    },
    { footerBtn: getFooterButtons() }
  )
}

const openDrawerView = (data = null) => {

  drawerUse.show(
    "Détails",
    "pi pi-eye",
    "right",
    "100%",
    markRaw(viewOption),
    { 
        data,
        getStockInfo,
        getDiscountPercent,
        getDiscountSeverity,
        formatXOF,
        toggleFavorite,
    },
    { footerBtn: null }
  )
}

// ------------------------ supprimer une ligne -----------------------------

function scrollToTop() {
    if (productTop.value) {
        productTop.value.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function updateCategoryOptions() {
    const unique = [...new Set(products.value.map(p => p.category))];

    categoryOptions.value = [
        { label: 'Tous', value: 'all' },
        ...unique.map(cat => ({
            label: cat,
            value: cat
        }))
    ];
}

// --- Helpers
function getStockInfo(product) {
    if (product.qte === 0) return { label: 'rupture', class: '!bg-red-600' };
    if (product.qte <= product.qteLimit) return { label: 'stock faible', class: '!bg-orange-500' };
    return { label: 'en stock', class: '!bg-green-600' };
}

// --- Calcul de pourcentage
function getDiscountPercent(product) {
    if (!product.prixReduc || product.prixReduc >= product.prix) return 0;

    const percent = ((product.prix - product.prixReduc) / product.prix) * 100;
    return Math.round(percent);
}

// --- Couleur de pourcentage
function getDiscountSeverity(percent) {
    if (percent >= 50) return 'danger';   // grosse promo
    if (percent >= 30) return 'warn';     // bonne promo
    if (percent >= 10) return 'info';     // petite promo
    return 'success';                     // très faible
}

function formatXOF(value) {
    if (!value) return '0 Fcfa';
    return new Intl.NumberFormat('fr-FR').format(value).replace(/,/g, '.') + ' Fcfa';
}

// --- Chargement initial
onMounted(() => {
    loadProducts(1, {
        searchQuery: searchQuery.value,
        selectedCategory: selectedCategory.value,
        layout: layout.value,
        minPrix: minPrix.value,
        maxPrix: maxPrix.value,
        livraison: selectedLivraison.value,
        stock: selectedStock.value,
    });
});
</script>

<style>

.flying-item {
    position: fixed;
    z-index: 9999;
    transition: all 0.7s cubic-bezier(.22,1,.36,1);
    pointer-events: none;
}

.favorite-btn .pi {
    transition: transform 0.2s ease;
}

.favorite-btn:active .pi {
    transform: scale(1.4);
}

.favorite-btn .pi-heart-fill {
    color: #ef4444;
    text-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
    animation: heartPop 0.4s ease;
}

@keyframes heartPop {
    0%   { transform: scale(0.5); }
    50%  { transform: scale(1.5); }
    100% { transform: scale(1); }
}
</style>