<template>
  <users-table />
</template>
<script setup>
definePageMeta({
  layout: 'custom',
  middleware: 'auth'
})
</script>
