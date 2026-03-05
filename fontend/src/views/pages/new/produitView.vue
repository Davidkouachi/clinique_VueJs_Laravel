<template>
    <div class="p-4 space-y-4">
        <!-- Informations principales -->
        <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
                <Galleria :value="images" :responsiveOptions="responsiveOptions" :numVisible="5" containerStyle="max-width: 640px">
                    <template #item="slotProps">
                        <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%" />
                    </template>
                    <template #thumbnail="slotProps">
                        <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" />
                    </template>
                </Galleria>
            </div>
            <div class="flex flex-col gap-2">
                <div class="flex flex-col justify-center items-center">
                    <img height="100" width="100" src="@/assets/img/docteur.png" />
                    <div class="text-lg font-medium mt-2">
                        {{ data?.nom ?? '-' }}
                    </div>
                    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">
                        {{ data?.id ?? '-' }}
                    </span>
                    
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-bold text-gray-900">Code :</span>
                <span class="text-gray-700">{{ data?.code ?? '-' }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { PhotoService } from '@/service/ProductListDetail';

defineProps({
  data: Object
});

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

onMounted(() => {
    PhotoService.getImages().then((data) => (images.value = data));
});

</script>