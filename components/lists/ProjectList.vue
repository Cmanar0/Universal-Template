<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6"><ProjectCard v-for="project in projects" :key="project.title" :project="project" /></div>
</template>

<script setup>
import ProjectCard from '../cards/ProjectCard.vue'

defineProps(['projects'])
</script>
