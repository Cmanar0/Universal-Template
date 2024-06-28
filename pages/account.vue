<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <account />
  </div>
</template>
<script setup>
definePageMeta({
  layout: 'custom',
  middleware: 'auth'
})
</script>
