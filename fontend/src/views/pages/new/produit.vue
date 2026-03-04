<script setup>
import { ProductService } from '@/service/ProductList';
import { ref, computed, onMounted } from 'vue';

// --- Références
const products = ref([]);
const layout = ref('grid');
const options = ref(['grid', 'list']);

const limit = 50;  
const currentPage = ref(1);
const totalProducts = ref(0);
const loading = ref(false);
const firstLoad = ref(true);

const selectedCategory = ref('all'); // Filtrage

// --- Charger les produits pour une page
const loadProducts = async (page = 1) => {
    loading.value = true;

    const offset = (page - 1) * limit;
    const result = await ProductService.getProductsPaginated(offset, limit);

    products.value = result || [];
    totalProducts.value = ProductService.getProductsData().length;

    loading.value = false;
    firstLoad.value = false;
    currentPage.value = page;
};

// --- Pagination
const totalPages = computed(() => Math.ceil(totalProducts.value / limit));
const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    loadProducts(page);
};

// --- Filtrage par catégorie
const categoryOptions = computed(() => {
    const unique = [...new Set(products.value.map(p => p.category))];
    return [
        { label: 'Tous', value: 'all' },
        ...unique.map(cat => ({ label: cat, value: cat }))
    ];
});

const filteredProducts = computed(() => {
    if (selectedCategory.value === 'all') return products.value;
    return products.value.filter(p => p.category === selectedCategory.value);
});

// --- Helpers
function getStockInfo(product) {
    if (product.qte === 0) return { label: 'rupture', class: '!bg-red-600' };
    if (product.qte <= product.qteLimit) return { label: 'stock faible', class: '!bg-orange-500' };
    return { label: 'en stock', class: '!bg-green-600' };
}

function formatXOF(value) {
    if (!value) return '0 Fcfa';
    return new Intl.NumberFormat('fr-FR').format(value).replace(/,/g, '.') + ' Fcfa';
}

// --- Chargement initial
onMounted(() => {
    loadProducts();
});
</script>

<template>
    <div class="flex flex-col">
        <div class="" >
            
            <div v-if="loading" class="flex flex-col gap-4">
                <!-- GRID Skeleton -->
                <div v-if="layout === 'grid'">
                    <div class="grid grid-cols-12 gap-4">
                        <div v-for="i in 6" :key="i" class="col-span-12 sm:col-span-6 xl:col-span-4 p-2">
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
                :value="filteredProducts" 
                :layout="layout" 
                :emptyMessage="''" 
                :pt="{
                    content: { class: '!bg-transparent' },
                    root: { class: '!bg-transparent border-none' }
                }">

                <template #header>
                    <div class="flex flex-col gap-3 w-full items-center">

                        <!-- WRAPPER SCROLLABLE -->
                        <div class="w-full overflow-x-auto">
                            <div class="min-w-max flex justify-center">
                                <SelectButton
                                    v-model="selectedCategory"
                                    :options="categoryOptions"
                                    optionLabel="label"
                                    optionValue="value"
                                    :allowEmpty="false"
                                />
                            </div>
                        </div>

                        <!-- GRID / LIST -->
                        <div class="flex justify-center">
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

                    </div>
                </template>

                <template #grid="slotProps">
                    <div class="grid grid-cols-12 gap-4 mt-3">
                        <div v-for="(item, index) in slotProps.items || []" :key="index" class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-4 xl:col-span-2 p-2" >
                            <div class="p-3 border border-surface-0 dark:border-surface-900 bg-surface-0 dark:bg-surface-900 rounded flex flex-col h-full">
                                <div class="bg-surface-50 flex justify-center rounded p-0 border-[0.1rem]">
                                    <div class="relative w-full h-55">
                                        <img
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
                                                <Badge value="-8%" size="large" severity="warn"></Badge>
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

                                            <span class="text-sm text-gray-600">
                                                Livraison rapide garantie sous 3 jours ouvrables
                                            </span>

                                        </div>

                                        <div class="flex gap-2">
                                            <Button
                                                severity="success"
                                                icon="pi pi-shopping-cart"
                                                label="Ajouter"
                                                :disabled="item.qte === 0"
                                                class="flex-auto whitespace-nowrap"
                                            />
                                            <Button
                                                label=""
                                                severity="warn"
                                                icon="pi pi-eye" 
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
                                    <img class="block xl:block mx-auto rounded w-full" :src="`https://primefaces.org/cdn/primevue/images/product/${item.img}`" :alt="item.nom" />
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
                                                    <Badge value="-8%" size="large" severity="warn"></Badge>
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
                                            <Button icon="pi pi-heart" outlined></Button>
                                            <Button
                                                label=""
                                                severity="warn"
                                                icon="pi pi-eye" 
                                            />
                                            <Button
                                                severity="success"
                                                icon="pi pi-shopping-cart"
                                                label="Ajouter"
                                                :disabled="item.qte === 0"
                                                class="flex-auto whitespace-nowrap"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <template #empty>
                    <!-- NE RIEN mettre ici pour le loader -->
                    <div> Rien n'a été trouver</div>
                </template>

            </DataView>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex justify-center gap-2 py-6">
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
            </div>

            <div v-if="loading && firstLoad" class="flex justify-center py-6">
                <ProgressSpinner style="width: 25px; height: 25px" strokeWidth="8" fill="transparent"/>
            </div>

        </div>
    </div>
</template>