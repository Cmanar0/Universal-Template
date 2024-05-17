<template>
  <div>
    <!-- Your other content here -->

    <!-- Use the modal component anywhere -->
    <ModalOneBtn />
    <GlobalSpinner />

    <NuxtPage />
  </div>
</template>

<script setup>
import ModalOneBtn from '../components/reusable/ModalOneBtn.vue' // Adjust the path as necessary
import GlobalSpinner from '../components/reusable/GlobalSpinner.vue' // Adjust the path as necessary
</script>
