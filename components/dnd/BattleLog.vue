<template>
  <div class="battle-log fixed bottom-0 left-0 w-full bg-white shadow-lg">
    <div
      @click="toggleLog"
      class="battle-log-header flex justify-between items-center bg-gray-800 text-white p-2"
    >
      <span>Battle Log</span>
      <button>
        <v-icon>{{ isClosed ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </button>
    </div>
    <div
      v-show="!isClosed"
      class="battle-log-content overflow-y-auto max-h-32 p-2"
    >
      <div
        v-for="(log, index) in logs"
        :key="index"
        v-html="log"
        class="log-entry mb-2"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  logs: Array
})

const isClosed = ref(false)

const toggleLog = () => {
  isClosed.value = !isClosed.value
}
</script>

<style scoped>
.battle-log {
  z-index: 1000;
  border-top: 1px solid #ddd;
}

.battle-log-header {
  cursor: pointer;
}

.battle-log-content {
  max-height: 50vh; /* Adjust based on your preference */
}
</style>
