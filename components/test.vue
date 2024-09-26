<template>
  <div>
    <h1>API Request Test</h1>
    <button @click="fetchProjects">Fetch Projects</button>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="projects && projects.length">
      <h2>Projects:</h2>
      <ul>
        <li v-for="project in projects" :key="project.id">{{ project.title }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// State variables
const projects = ref([])
const error = ref(null)

// Replace with your actual token
const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjA1N2ZkZDRkLTk0MmItNDEwYS04MzEyLWZjYWQyZDlhYTU3MiIsImVtYWlsIjoidGVzdEB0ZXN0LmN6IiwiZmlyc3ROYW1lIjpudWxsLCJsYXN0TmFtZSI6bnVsbCwiaXNBY3RpdmUiOnRydWUsImxhbmciOiJlbiIsImlhdCI6MTcyNjgzNTEyMiwiZXhwIjoxNzI3NDM5OTIyfQ.x-zvo6bxzbqjgxshaIOq9mi-1zh2NfFAKrY2gQpGMF8'

// Function to fetch projects
const fetchProjects = async () => {
  error.value = null // Reset error
  try {
    const response = await fetch('https://business-viability--two.vercel.app/api/projects', {
      method: 'GET',
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }

    const data = await response.json()
    projects.value = data // Assuming data is an array of projects
  } catch (err) {
    error.value = `Failed to fetch projects: ${err.message}`
  }
}
</script>

<style scoped>
.error {
  color: red;
}
</style>
