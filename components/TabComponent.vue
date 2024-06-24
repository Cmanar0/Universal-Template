<template>
  <v-card>
    <v-toolbar color="#1697F6">
      <v-tabs v-model="tab" align-tabs="title">
        <v-tab v-for="item in items" :key="item.value" :value="item.value">
          {{ item.text }}
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item v-for="item in items" :key="item.value" :value="item.value">
        <v-card flat>
          <v-card-text>
            <component :is="item.component"></component>
          </v-card-text>
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import Project from '@/components/project-sections/Project.vue' // Adjust the path as necessary
import Products from '@/components/project-sections/Products.vue'

const tab = ref('web')
const items = [
  { value: 'pescription', text: 'Description', component: Project },
  { value: 'products', text: 'Products', component: Products }
]
</script>

<style scoped>
/* Add any additional styling if necessary */
</style>
