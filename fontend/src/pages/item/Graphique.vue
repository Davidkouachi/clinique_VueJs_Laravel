<template>
  <Layout>
    <div class="content p-4">
      <h4 class="fw-bold mb-4">Graphiques</h4>

      <div class="row g-4">
        <!-- Bar Chart -->
        <div class="col-lg-6">
          <div class="card p-3 chart-card">
            <h6 class="fw-semibold mb-3">Graphique en barres</h6>
            <div class="chart-container">
              <Bar :data="barData" :options="options" />
            </div>
          </div>
        </div>

        <!-- Line Chart -->
        <div class="col-lg-6">
          <div class="card p-3 chart-card">
            <h6 class="fw-semibold mb-3">Graphique en ligne</h6>
            <div class="chart-container">
              <Line :data="lineData" :options="options" />
            </div>
          </div>
        </div>

        <!-- Pie Chart -->
        <div class="col-lg-6">
          <div class="card p-3 chart-card">
            <h6 class="fw-semibold mb-3">Camembert</h6>
            <div class="chart-container">
              <Pie :data="pieData" :options="pieOptions" :plugins="[ChartDataLabels]" />
            </div>
          </div>
        </div>

        <!-- Doughnut Chart -->
        <div class="col-lg-6">
          <div class="card p-3 chart-card">
            <h6 class="fw-semibold mb-3">Doughnut</h6>
            <div class="chart-container">
              <Doughnut :data="pieData" :options="pieOptions" :plugins="[ChartDataLabels]" />
            </div>
          </div>
        </div>

        <!-- Mixed Chart -->
        <div class="col-lg-6">
          <div class="card p-3 chart-card">
            <h6 class="fw-semibold mb-3">Combiné (Bar + Line)</h6>
            <div class="chart-container">
              <Bar :data="mixedData" :options="options" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import Layout from '@/layout/applayout.vue'
import { ref, onMounted, nextTick } from 'vue'
import { usePreloaderStore } from '@/stores/preloader'
import { Bar, Line, Pie, Doughnut } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  // ChartDataLabels // ✅ on désactive la légende
)

const preloader = usePreloaderStore()

// 🔹 Données graphiques
const barData = ref({
  labels: ['Janvier', 'Février', 'Mars', 'Avril'],
  datasets: [{ label: 'Ventes', backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#e91e63'], data: [40, 60, 75, 90] }],
})

const lineData = ref({
  labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'],
  datasets: [{ label: 'Visites', borderColor: '#2196f3', backgroundColor: 'rgba(33,150,243,0.2)', tension: 0.4, fill: true, data: [12, 19, 3, 5, 2] }],
})

const mixedData = ref({
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    { type: 'bar', label: 'Revenus', backgroundColor: '#4caf50', data: [100, 150, 130, 170] },
    { type: 'line', label: 'Croissance (%)', borderColor: '#f44336', borderWidth: 2, fill: false, data: [10, 20, 15, 25] },
  ],
})

const pieData = ref({
  labels: ['Chrome', 'Firefox', 'Safari', 'Edge'],
  datasets: [{ label: 'Navigateurs', backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#e91e63'], data: [45, 25, 20, 10] }],
})

// 🔹 Options générales (Bar, Line, Mixed)
const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { 
      position: 'bottom', 
      labels: { 
        font: { 
          size: 12, 
        } 
      } 
    }
  },
})

// 🔹 Options Pie & Doughnut avec pourcentage
const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      position: 'bottom', 
      labels: { 
        font: { 
          size: 12 
        } 
      } 
    },
    datalabels: {
      color: '#fff',
      formatter: (value, context) => {
        const data = context.chart.data.datasets[0].data
        const total = data.reduce((a, b) => a + b, 0)
        return ((value / total) * 100).toFixed(1) + '%'
      },
      font: { weight: 'bold', size: 14 },
    },
  },
}

onMounted(async () => {
  preloader.hide()
  await nextTick()
})
</script>



<style scoped>
.card {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
.chart-container {
  position: relative;
  height: 280px; /* ✅ fixe la hauteur pour stabiliser */
  width: 100%;
}
.chart-card {
  min-height: 350px;
}
</style>
