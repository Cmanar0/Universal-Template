<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <dashboard />

    <!-- New project list content -->
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

<script setup>
import { ref, reactive, onMounted } from 'vue'
import projectStore from '@/stores/project.store.js' // Import the plain JavaScript store

// Local state variables
const loading = ref(false)
const error = ref('')
const projects = reactive(projectStore.projects) // Bind the projects to the store's projects array

// Function to load projects using the plain JavaScript store
async function loadProjects() {
  loading.value = true
  error.value = ''
  try {
    await projectStore.loadProjects()
    // Reassign the projects array to trigger reactivity
    Object.assign(projects, projectStore.projects)
  } catch (err) {
    error.value = 'Failed to load projects.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Load projects when the component is mounted
onMounted(loadProjects)

definePageMeta({
  layout: 'custom',
  middleware: 'auth'
})
</script>

<style scoped>
/* Add any additional styling if necessary */
</style>
