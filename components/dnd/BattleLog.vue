<template>
  <div
    :class="['battle-log', { 'battle-log-closed': isClosed }]"
    :style="logStyle"
  >
    <div class="battle-log-header" @click="toggleLog">
      <h3 class="text-xl">Battle Log</h3>
      <v-btn icon>
        <v-icon>{{ isClosed ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </div>
    <div v-show="!isClosed" class="battle-log-content" ref="logContent">
      <ul>
        <li v-for="log in logs" :key="log" v-html="log"></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'

const props = defineProps({
  logs: {
    type: Array,
    required: true
  }
})

const isClosed = ref(false)
const logContent = ref(null)

const toggleLog = () => {
  isClosed.value = !isClosed.value
}

const scrollToBottom = () => {
  if (logContent.value) {
    logContent.value.scrollTop = logContent.value.scrollHeight
  }
}

const { mdAndUp } = useDisplay()

const logStyle = computed(() => {
  if (mdAndUp.value) {
    return {
      left: '0',
      width: '50%'
    }
  } else {
    return {
      width: '100%'
    }
  }
})

watch(props.logs, () => {
  scrollToBottom()
})
</script>

<style scoped>
.battle-log {
  position: fixed;
  bottom: 0;
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
  background: #ececec;
  border-top: 1px solid #ddd;
  cursor: pointer;
  z-index: 1;
}
.battle-log-content {
  padding: 10px;
}
</style>
