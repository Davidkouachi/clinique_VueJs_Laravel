<script setup>
const props = defineProps({
  source: Object,
  index: Number,
  onView: Function,  // Reçu depuis data-component-props
  onEdit: Function
})

const handleView = () => {
  props.onView?.(props.source) ?? console.warn('onView n’est pas défini !')
}

const handleEdit = () => {
  props.onEdit?.(props.source) ?? console.warn('onEdit n’est pas défini !')
}

</script>

<template>
  <div class="virtual-tr d-flex">
    <div class="virtual-td flex-1">{{ index + 1 }}</div>
    <div class="virtual-td flex-3">{{ source?.name || 'N/A' }}</div>
    <div class="virtual-td flex-3">{{ source?.email || 'N/A' }}</div>
    <div class="virtual-td flex-2">{{ source?.login || 'N/A' }}</div>
    <div class="virtual-td flex-2">Disponible</div>
    <div class="virtual-td flex-3">
      <button class="btn btn-sm btn-info me-1" @click="handleEdit(source)">Mise à jour</button>
      <button class="btn btn-sm btn-warning" @click="handleView(source)">Détails</button>
    </div>
  </div>
</template>



<style scoped>
.virtual-tr {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #dee2e6;
}
.virtual-td {
  padding: 0 8px;
  display: flex;
  align-items: center;
}
.flex-1 { flex: 1; }
.flex-2 { flex: 2; }
.flex-3 { flex: 3; }
.btn { cursor: pointer; }
</style>
