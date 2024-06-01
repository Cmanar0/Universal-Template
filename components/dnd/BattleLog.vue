<template>
  <div :class="['battle-log', { 'battle-log-closed': isClosed }]">
    <div class="battle-log-header" @click="toggleLog">
      <h3 class="text-xl">Battle Log</h3>
      <v-btn icon>
        <v-icon>{{ isClosed ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </div>
    <div v-show="!isClosed" class="battle-log-content">
      <ul>
        <li v-for="log in logs" :key="log" v-html="log"></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  logs: {
    type: Array,
    required: true
  }
})

const isClosed = ref(false)

const toggleLog = () => {
  isClosed.value = !isClosed.value
}
</script>

<style scoped>
.battle-log {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  max-height: 33vh;
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  transition: transform 0.3s ease;
}
.battle-log-closed .battle-log-content {
  display: none;
}
.battle-log-header {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
  cursor: pointer;
  z-index: 1;
}
.battle-log-content {
  padding: 10px;
}
</style>
