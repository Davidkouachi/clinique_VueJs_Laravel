<script setup>
import { ProductService } from '@/service/ProductList';
import { onMounted, onBeforeUnmount, ref } from 'vue';

const products = ref([]);
const layout = ref('grid');
const options = ref(['grid', 'list']);

const limit = 20;
const offset = ref(0);
const loading = ref(false);
const hasMore = ref(true);
const firstLoad = ref(true);

const loadProducts = async () => {
    if (loading.value || !hasMore.value) return;

    loading.value = true;

    const newProducts = await ProductService.getProductsPaginated(
        offset.value,
        limit
    );

    if (newProducts.length < limit) {
        hasMore.value = false;
    }

    products.value.push(...newProducts);
    offset.value += limit;
    loading.value = false;

    // On a fini le premier chargement
    if (firstLoad.value) firstLoad.value = false;

    console.log('Offset:', offset.value, 'Produits chargés:', newProducts.length);

};

const handleScroll = () => {
    const scrollBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;

    if (scrollBottom) {
        loadProducts();
    }
};

onMounted(() => {
    loadProducts(); // 20 premiers
    window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});

function getSeverity(product) {
    switch (product.inventoryStatus) {
        case 'INSTOCK':
            return 'success';
        case 'LOWSTOCK':
            return 'warning';
        case 'OUTOFSTOCK':
            return 'danger';
        default:
            return null;
    }
}
</script>

<template>
    <div class="flex flex-col">
        <div class="card">
            <div class="font-semibold text-xl">Produits</div>

            <!-- Skeletons pendant le premier chargement -->
            <div v-if="loading && firstLoad" class="flex flex-col gap-4">
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

            <DataView v-else :value="products" :layout="layout" :emptyMessage="''">

                <template #header>
                    <div class="flex justify-center">
                        <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                            <template #option="{ option }">
                                <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
                            </template>
                        </SelectButton>
                    </div>
                </template>

                <template #grid="slotProps">
                    <div class="grid grid-cols-12 gap-4">
                        <div v-for="(item, index) in slotProps.items" :key="index" class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 p-2" >
                            <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col h-full">
                                <div class="bg-surface-50 flex justify-center rounded p-4">
                                    <div class="relative mx-auto">
                                        <img class="rounded w-full" :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`" :alt="item.name" style="max-width: 300px" />
                                        <Tag :value="item.inventoryStatus" :severity="getSeverity(item)" class="absolute dark:!bg-surface-900" style="left: 4px; top: 4px" />
                                    </div>
                                </div>
                                <div class="pt-6 flex flex-col flex-1">
                                    <div class="flex flex-row justify-between items-start gap-2">
                                        <div class="flex-1">
                                            <span class="font-medium text-surface-500 dark:text-surface-400 text-sm" >
                                                {{ item.category }}
                                            </span>

                                            <div class="text-lg font-medium mt-1 line-clamp-2">
                                                {{ item.name }}
                                            </div>
                                        </div>

                                        <div class="bg-surface-100 p-1" style="border-radius: 30px">
                                            <div
                                                class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2"
                                                style="
                                                    border-radius: 30px;
                                                    box-shadow:
                                                        0px 1px 2px 0px rgba(0, 0, 0, 0.04),
                                                        0px 1px 2px 0px rgba(0, 0, 0, 0.06);
                                                "
                                            >
                                                <span class="text-surface-900 font-medium text-sm">
                                                    {{ item.rating }}
                                                </span>
                                                <i class="pi pi-star-fill text-yellow-500"></i>
                                            </div>
                                        </div>
                                    </div>

                                    
                                    <div class="flex flex-col gap-6 mt-auto">
                                        <span class="text-2xl font-semibold">
                                            ${{ item.price }}
                                        </span>

                                        <div class="flex gap-2">
                                            <Button
                                                icon="pi pi-shopping-cart"
                                                label="Buy Now"
                                                :disabled="item.inventoryStatus === 'OUTOFSTOCK'"
                                                class="flex-auto whitespace-nowrap"
                                            />
                                            <Button icon="pi pi-heart" outlined />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </template>

                <template #list="slotProps">
                    <div class="flex flex-col">
                        <div v-for="(item, index) in slotProps.items" :key="index">
                            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" :class="{ 'border-t border-surface': index !== 0 }">
                                <div class="md:w-40 relative">
                                    <img class="block xl:block mx-auto rounded w-full" :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`" :alt="item.name" />
                                    <Tag :value="item.inventoryStatus" :severity="getSeverity(item)" class="absolute dark:!bg-surface-900" style="left: 4px; top: 4px"></Tag>
                                </div>
                                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                    <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                        <div>
                                            <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.category }}</span>
                                            <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                                        </div>
                                        <div class="bg-surface-100 p-1" style="border-radius: 30px">
                                            <div
                                                class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2"
                                                style="
                                                    border-radius: 30px;
                                                    box-shadow:
                                                        0px 1px 2px 0px rgba(0, 0, 0, 0.04),
                                                        0px 1px 2px 0px rgba(0, 0, 0, 0.06);
                                                "
                                            >
                                                <span class="text-surface-900 font-medium text-sm">{{ item.rating }}</span>
                                                <i class="pi pi-star-fill text-yellow-500"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col md:items-end gap-8">
                                        <span class="text-xl font-semibold">${{ item.price }}</span>
                                        <div class="flex flex-row-reverse md:flex-row gap-2">
                                            <Button icon="pi pi-heart" outlined></Button>
                                            <Button icon="pi pi-shopping-cart" label="Buy Now" :disabled="item.inventoryStatus === 'OUTOFSTOCK'" class="flex-auto md:flex-initial whitespace-nowrap"></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <template #empty>
                    <!-- NE RIEN mettre ici pour le loader -->
                    <div> </div>
                </template>

            </DataView>

            <div v-if="loading && products.length > 0" class="flex justify-center py-6">
                <ProgressSpinner style="width: 25px; height: 25px" strokeWidth="8" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
            </div>

            <div v-if="!loading && !hasMore && products.length" class="text-center py-6 text-surface-400 text-sm" >
                Tous les produits ont été chargés
            </div>
        </div>
    </div>
</template>
