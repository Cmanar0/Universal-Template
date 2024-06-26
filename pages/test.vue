<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <Test />
  </div>
</template>

<script setup>
import Test from '@/components/Test.vue'

definePageMeta({
  layout: 'custom',
  middleware: 'auth'
})
</script>

<style scoped>
/* Add any additional styling if necessary */
</style>
