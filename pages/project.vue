<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <TabComponent />
  </div>
</template>

<script setup>
import TabComponent from '@/components/TabComponent.vue'

definePageMeta({
  layout: 'custom',
  middleware: 'auth'
})
</script>

<style scoped>
/* Add any additional styling if necessary */
</style>
