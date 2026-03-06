<template>
    <div class="p-4 space-y-4">
        <!-- Informations principales -->
        <div class="grid grid-cols-12 gap-6">
            <div class="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-6 xl:col-span-6 p-2 flex flex-col gap-2">
                <Galleria :value="images" :responsiveOptions="responsiveOptions" :numVisible="5" containerStyle="max-width: 100%">
                    <template #item="slotProps">
                        <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%" />
                    </template>
                    <template #thumbnail="slotProps">
                        <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" />
                    </template>
                </Galleria>
            </div>
            <div class="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-6 xl:col-span-6 p-2 flex flex-col gap-2">
                <div class="flex flex-col gap-2">
                    <div class="font-bold text-md text-surface-800">
                        {{ props.data?.category ?? '-' }}
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="font-normal text-4xl text-surface-800">
                        {{ props.data?.nom ?? '-' }}
                    </div>
                </div>
                <div class="flex flex-col gap-2">

                    <div class="flex flex-col items-start gap-2 mt-auto mb-0">

                        <!-- Si réduction existe -->
                        <template v-if="props.data.prixReduc">

                            <!-- Nouveau prix -->
                            <span class="font-bold text-3xl text-surface-900">
                                {{ props.data?.prixReduc != null ? props.formatXOF(props.data.prixReduc) : '0 Fcfa' }}
                            </span>

                            <!-- Ancien prix barré -->
                            <div class="flex items-center gap-2">
                                <span class="font-normal text-xl line-through text-surface-500">
                                    {{ props.data?.prix != null ? props.formatXOF(props.data.prix) : '0 Fcfa' }}
                                </span>
                                <Badge
                                    v-if="props.getDiscountPercent(props.data) > 0"
                                    :value="`-${props.getDiscountPercent(props.data)}% de réduction`"
                                    size="large"
                                    :severity="props.getDiscountSeverity(props.getDiscountPercent(props.data))"
                                />
                            </div>

                        </template>

                        <!-- Sinon prix normal -->
                        <template v-else>
                            <span class="text-lg font-bold text-blue-800">
                                {{ props.data?.prix != null ? props.formatXOF(props.data.prix) : '0 Fcfa' }}
                            </span>
                        </template>

                    </div>
                </div>
                <div class="flex flex-col gap-2 pb-6">
                    <div class="font-normal text-4xl text-surface-800">
                        <Badge
                            :value="props.getStockInfo(props.data).label"
                            :class="['border-none !text-white',props.getStockInfo(props.data).class]"
                            size="xlarge"
                        />
                    </div>
                </div>
                <div class="border-t pt-5">
                    <Fieldset legend="Description">
                        <div class="text-surface-800 flex items-left m-0">
                            <ul class="m-0 list-none surface rounded p-4 flex flex-col gap-2 w-full">
                                <li
                                    v-for="item in desc"
                                    class="p-2 rounded transition-all duration-200 flex items-center justify-content-between" >

                                    <div class="flex flex-1 items-center gap-2">
                                        <span class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm" :style="{ backgroundColor: item.color }">
                                            <i :class="item.icon"></i>
                                        </span>
                                        <span class="font-bold">{{ item.label }}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </Fieldset>
                    
                </div>
            </div>
            <div class="col-span-12">
                <div class="card !bg-surface-300" >
                    <div class="flex justify-center items-center mb-6">
                        <div class="font-bold text-2xl text-surface-800">
                            Articles similaires
                        </div>
                    </div>
                    <Carousel :value="products" :numVisible="7" :numScroll="1" :responsiveOptions="responsiveOptionsProducts" class="rounded">
                        <!-- bouton gauche -->
                        <template #previcon>
                            <div class="bg-surface-0 p-5 rounded-full" >
                                <i class="pi pi-angle-left text-2xl text-surface-500"></i>
                            </div>
                        </template>

                        <template #item="slotProps">
                            <div class="bg-surface-0 dark:bg-surface-700 rounded m-2  p-4">
                                <div class="mb-4">
                                    <div class="relative mx-auto">
                                        <img :src="'https://primefaces.org/cdn/primevue/images/product/' + slotProps.data.image" :alt="slotProps.data.name" class="w-full rounded" />
                                        <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data.inventoryStatus)" class="absolute" style="left:5px; top: 5px"/>
                                    </div>
                                </div>
                                <div class="mb-4 font-medium">{{ slotProps.data.name }}</div>
                                <div class="flex justify-between items-center">
                                    <div class="mt-0 font-semibold text-xl">${{ slotProps.data.price }}</div>
                                    <span>
                                        <Button icon="pi pi-heart" severity="secondary" variant="outlined" />
                                        <Button icon="pi pi-shopping-cart" class="ml-2"/>
                                    </span>
                                </div>
                            </div>
                        </template>

                        <!-- bouton droite -->
                        <template #nexticon>
                            <div class="bg-surface-0 p-5 rounded-full" >
                                <i class="pi pi-angle-right text-2xl text-surface-500"></i>
                            </div>
                        </template>
                    </Carousel>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { PhotoService } from '@/service/ProductListDetail';

const props = defineProps({
    data: Object,
    categoryOptions: Function,
    getStockInfo: Function,
    getDiscountPercent: Function,
    getDiscountSeverity: Function,
    formatXOF: Function
});

const desc = ref([
    { 
        label: props.data?.livraison === 1 
            ? 'Livraison gratuite pour cet article' 
            : 'Livraison payante pour cet article', 
        icon: 'pi pi-truck',
        color: 'green'
    },
    { 
        label: 'Livraison rapide garantie sous 3 jours ouvrables', 
        icon: 'pi pi-truck',
        color: 'gray'
    }
])

const images = ref();
const responsiveOptions = ref([
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);

const products = ref();
const responsiveOptionsProducts = ref([
    { breakpoint: '1600px', numVisible: 6, numScroll: 1 },
    { breakpoint: '1400px', numVisible: 5, numScroll: 1 },
    { breakpoint: '1200px', numVisible: 4, numScroll: 1 },
    { breakpoint: '992px', numVisible: 3, numScroll: 1 },
    { breakpoint: '768px', numVisible: 2, numScroll: 1 },
    { breakpoint: '576px', numVisible: 1, numScroll: 1 }
])

const getSeverity = (status) => {
    switch (status) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warn';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
};

onMounted(() => {
    PhotoService.getImages().then((data) => (images.value = data));
    PhotoService.getProductsSmall().then((data) => (products.value = data.slice(0, 9)));
});

</script>

<style scoped>

.p-timeline-left .p-timeline-event {
    margin-left: 0 !important;
}

.p-timeline-left .p-timeline-event-content {
    text-align: left !important;
}
</style>