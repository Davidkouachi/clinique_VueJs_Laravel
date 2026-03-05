<template>
    <div class="flex flex-col gap-6 p-4">
        <div>
            <label class="block mb-2 font-medium">Mode d'affichage</label>
            <SelectButton v-model="localLayout" :options="['grid','list']" :allowEmpty="false">
                <template #option="{ option }">
                    <i :class="[option === 'list' ? 'pi pi-list' : 'pi pi-th-large']" />
                </template>
            </SelectButton>
        </div>
        <!-- Recherche texte -->
        <div>
            <label class="block mb-2 font-medium">Recherche</label>
            <input v-model="localSearchQuery" type="text" placeholder="Nom ou catégorie..." class="w-full px-4 py-2 border rounded-lg" />
        </div>
        <!-- Catégories -->
        <div>
            <label class="block mb-2 font-medium">Catégorie</label>
            <div class="h-[17.7rem] overflow-y-auto pr-2 border rounded-lg p-2">
                <SelectButton v-model="localSelectedCategory" :options="props.categoryOptions()" optionLabel="label" optionValue="value" :allowEmpty="false" :pt="{ root: { class: 'flex flex-col gap-2 w-full' }, button: { class: 'w-full text-left justify-start' } }" />
            </div>
        </div>
        <!-- Filtre par prix -->
        <div class="flex flex-col gap-0">
            <label class="block mb-2 font-medium">Montant</label>
            <div class="flex flex-row justify-between" >
                <IftaLabel>
                    <InputNumber
                        id="min-price"
                        v-model="localMinPrix"
                        inputId="min-price"
                        mode="currency"
                        currency="XOF"
                        locale="fr-FR"
                        class="w-full"
                        :min="0"
                    />
                    <label for="min-price">Min</label>
                </IftaLabel>
                <IftaLabel>
                    <InputNumber
                        v-model="localMaxPrix"
                        inputId="max-price"
                        mode="currency"
                        currency="XOF"
                        locale="fr-FR"
                        class="w-full"
                        :min="0"
                    />
                    <label for="max-price">Max</label>
                </IftaLabel>
            </div>
        </div>
        <div>
            <label class="block mb-2 font-medium">Statut</label>
            <SelectButton v-model="localSelectedStock" :options="props.stockOptions()" optionLabel="label" optionValue="value" :allowEmpty="false" :pt="{ root: { class: 'flex flex-row gap-1 w-full' }, button: { class: 'w-full text-center justify-center' } }" />
        </div>
        <div>
            <label class="block mb-2 font-medium">Livraison</label>
            <SelectButton v-model="localSelectedLivraison" :options="props.livraisonOptions()" optionLabel="label" optionValue="value" :allowEmpty="false" :pt="{ root: { class: 'flex flex-row gap-1 w-full' }, button: { class: 'w-full text-center justify-center' } }" />
        </div>
    </div>
</template>


<script setup>
import { ref, watch } from 'vue'
import { useDrawerStore } from '@/function/stores/drawer'

const props = defineProps({
  searchQuery: String,
  minPrix: Number,
  maxPrix: Number,
  selectedLivraison: Number,
  selectedCategory: Number,
  selectedStock: Number,
  layout: String,
  categoryOptions: Function,
  livraisonOptions: Function,
  stockOptions: Function,
  applyFilters: Function,
  reloadloadProducts: Function,
})

const drawerUse = useDrawerStore()

// --- refs locales pour éviter readonly
const localSearchQuery = ref(props.searchQuery)
const localSelectedCategory = ref(props.selectedCategory ?? 0)
const localSelectedLivraison = ref(props.selectedLivraison ?? 0)
const localSelectedStock = ref(props.selectedStock ?? 0)
const localLayout = ref(props.layout)
const localMinPrix = ref(props.minPrix ?? 0)
const localMaxPrix = ref(props.maxPrix ?? 1000000)

// --- form submit
const formSubmit = () => {

  props.applyFilters?.({
    searchQuery: localSearchQuery.value,
    selectedCategory: localSelectedCategory.value,
    layout: localLayout.value,
    minPrix: localMinPrix.value,
    maxPrix: localMaxPrix.value,
    selectedLivraison: localSelectedLivraison.value,
    selectedStock: localSelectedStock.value
  })
  drawerUse.hide()
}

const resetSubmit = () => {

  props.reloadloadProducts()
  drawerUse.hide()
}

// --- exposer submit pour drawer
defineExpose(
    { 
        submit: formSubmit,
        reset: resetSubmit
    }
)
</script>