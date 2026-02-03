<template>
    <TitrePage />
    <Fluid>
        
    </Fluid>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/function/services/axios';
import { useToastAlert } from '@/function/function/ToastAlert';
import TitrePage from '@/layout/elements/TitrePage.vue';
// import './style.css';
import { onlyNumbers, onlyUppercase } from '@/function/format';

const { showToast } = useToastAlert();

onMounted(() => {
    // onlyNumbers('telephone1', 10);
    // onlyNumbers('telephone2', 10);
});


</script>
