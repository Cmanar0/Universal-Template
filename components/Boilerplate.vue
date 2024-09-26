<template>
  <div>
    <!-- Your template content goes here -->
  </div>
</template>

<script setup lang="ts">
// ===================== IMPORTS =====================
import { ref, reactive, computed, watch, onMounted, onUnmounted, defineProps, defineEmits } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProjectStore } from '../stores/project.store' // Pinia store import

// ===================== PROPS =====================
const props = defineProps<{
  title: string // Example prop
  count?: number // Optional prop with default value
}>()

// ===================== EMITS =====================
const emit = defineEmits<{
  (event: 'update', value: string): void // Example emit event
  (event: 'submit', data: object): void // Another emit event
}>()

// ===================== INSTANCES =====================
const router = useRouter() // Vue Router instance
const route = useRoute() // Vue Route instance
const store = useProjectStore() // Pinia store instance

// ===================== VARIABLES =====================
const apiEndpoint = 'https://api.example.com'

// ===================== STATE =====================
const userInfo = ref<{ name: string; age: number }>({
  name: '',
  age: 0
})

// ===================== COMPUTED =====================
const userGreeting = computed(() => {
  return `Hello, ${userInfo.value.name}!`
})

// ===================== METHODS =====================
const logMessage = (message: string) => {
  console.log(message)
}
// ===================== WATCHERS =====================
watch(userInfo, (newValue, oldValue) => {
  console.log(`User info changed from ${oldValue} to ${newValue}`)
})

// ===================== LIFECYCLE HOOKS =====================
onMounted(() => {
  console.log('Component mounted')
  logMessage('logged message')
  store.loadProjects()
})

onUnmounted(() => {
  console.log('Component unmounted')
})
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
