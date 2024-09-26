<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <Project />
  </div>
</template>

<script setup>
import Project from '@/components/Project.vue'
import { useRoute } from 'vue-router'
const route = useRoute() // Access the route object

// Now you can access the `id` query parameter like this:
const projectId = route.query.id
console.log('projectId :>> ', projectId)

definePageMeta({
  layout: 'custom',
  middleware: 'auth'
})
</script>

<style scoped>
/* Add any additional styling if necessary */
</style>
