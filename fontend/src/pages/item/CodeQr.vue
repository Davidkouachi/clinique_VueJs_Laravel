<template>
  <Layout>
    <div class="content pb-0">
      <div class="d-flex align-items-sm-center justify-content-left mb-4">
        <div>
          <h4 class="fw-bold mb-0">Code QR</h4>
        </div>
      </div>
      <div class="pb-0 d-flex align-items-center justify-content-center">
        <div class="card rounded-0 div_centrale">
          <div class="container-fluid">
            <div class="w-100 position-relative flex-wrap d-block">
              <div class="row justify-content-center align-items-center p-5">
                
                <div class="col-12 text-center">
                  <div class="qr-wrapper position-relative d-inline-block">
                    
                    <!-- ✅ QR CODE -->
                    <qrcode-vue
                      :value="qrValue"
                      :size="200"
                      level="H"
                    />

                    <!-- ✅ IMAGE AU CENTRE -->
                    <img
                      src="@/assets/img/logo.png"
                      alt="Logo"
                      class="qr-logo"
                    />
                  </div>

                  <h5 class="fw-bold mt-4 mb-2">Scannez ce code QR</h5>
                  <p class="fs-16">
                    Vous pouvez aussi copier ce lien :<br>
                    <a :href="qrValue" target="_blank">{{ qrValue }}</a>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Layout from '@/layout/applayout.vue'
import { usePreloaderStore } from '@/stores/preloader'
import QrcodeVue from 'qrcode.vue'

const preloader = usePreloaderStore()
const qrValue = ref('http://localhost:5173') // 🔹 Lien à encoder

onMounted(async () => {
  preloader.hide()
  await nextTick()
})
</script>

<style scoped>

.div_centrale {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ✅ Le conteneur du QR */
.qr-wrapper {
  position: relative;
  display: inline-block;
}

/* ✅ image au centre du QR */
.qr-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px; /* taille du logo */
  height: 50px;
  border-radius: 0px; /* facultatif */
  background: white; /* fond blanc pour lisibilité */
  padding: 4px; /* marge interne */
}
</style>
