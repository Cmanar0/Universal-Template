<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <dashboard />

    <!-- Display projects based on the loading and error states -->
    <div v-if="loading" class="text-center mt-8">Loading projects...</div>
    <div v-else-if="error" class="text-center text-red-500 mt-8">{{ error }}</div>
    <div v-else-if="projects.length === 0" class="text-center mt-8">No projects available</div>
    <div v-else class="mt-8">
      <div v-for="project in projects" :key="project.id" class="p-4 border rounded mb-4 bg-white">
        <h2 class="text-xl font-bold">{{ project.title }}</h2>
        <p>Value: {{ project.value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===================== IMPORTS =====================
import { ref, onMounted } from 'vue'
import { useProjectsStore } from '../stores/project.store'

// ===================== META =====================
definePageMeta({
  layout: 'custom',
  middleware: 'auth'
})

// ===================== STATE =====================
// Local state variables for loading and error handling
const loading = ref(false)
const error = ref('')

// ===================== INSTANCES =====================
// Instantiate the projects store
const projectsStore = useProjectsStore()

// ===================== COMPUTED =====================
// Computed property to get the projects from the store
const projects = projectsStore.projects

// ===================== METHODS =====================
// Function to load projects from the store
const loadProjects = async () => {
  loading.value = true
  error.value = ''
  try {
    await projectsStore.fetchAllProjects()
  } catch (err) {
    error.value = 'Failed to load projects.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// ===================== LIFECYCLE HOOKS =====================
// Load projects when the component is mounted
onMounted(loadProjects)
</script>

<style scoped>
/* Add any additional styling if necessary */
</style>
