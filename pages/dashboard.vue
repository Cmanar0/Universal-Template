<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <dashboard />

    <!-- Display projects based on the loading and error states -->
    <div class="mt-8">
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
  await projectsStore.fetchAllProjects()
  console.log('projects :>> ', projects)
}

// ===================== LIFECYCLE HOOKS =====================
// Load projects when the component is mounted
onMounted(loadProjects)
</script>

<style scoped>
/* Add any additional styling if necessary */
</style>
