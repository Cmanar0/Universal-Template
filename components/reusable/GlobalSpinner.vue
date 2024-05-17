<template>
  <div
    v-if="isLoadIndicatorVisible"
    class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-40 z-50"
  >
    <div class="loader"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import mittBus from '../../utils/mitt.js'

const isLoadIndicatorVisible = ref(false)

const setIsLoadIndicatorVisibleTrue = () => {
  console.log('GGGGGGGGGGGGGGGGGGGGGGGGGGGGG :>> ')
  isLoadIndicatorVisible.value = true
}

const setIsLoadIndicatorVisibleFalse = () => {
  isLoadIndicatorVisible.value = false
}

onMounted(() => {
  mittBus.on('loader-on', setIsLoadIndicatorVisibleTrue)
  mittBus.on('loader-off', setIsLoadIndicatorVisibleFalse)
})

onBeforeUnmount(() => {
  mittBus.off('loader-on', setIsLoadIndicatorVisibleTrue)
  mittBus.off('loader-off', setIsLoadIndicatorVisibleFalse)
})
</script>

<style scoped>
.loader {
  border: 6px solid rgba(255, 255, 255, 0.128); /* Light gray */
  border-top: 4px solid white; /* White */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  z-index: 5100; /* Ensure the spinner itself is above other elements */
}

.fixed {
  z-index: 5000; /* Ensure the overlay is sufficiently high */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
