<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <users-table />
  </div>
</template>
<script setup>
definePageMeta({
  layout: 'custom',
  middleware: 'auth'
})
</script>
