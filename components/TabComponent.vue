<template>
  <v-toolbar class="mx-1 custom-header" color="#1697F6">
    <v-tabs v-model="tab" align-tabs="title">
      <v-tab v-for="item in items" :key="item.value" :value="item.value">
        {{ item.text }}
      </v-tab>
    </v-tabs>
  </v-toolbar>

  <v-tabs-window id="tab-project" v-model="tab" class="custom-tabs-window">
    <v-tabs-window-item v-for="item in items" :key="item.value" :value="item.value">
      <component :is="item.component"></component>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup>
import { ref } from 'vue'
import Project from '@/components/project-sections/Project.vue' // Adjust the path as necessary
import Products from '@/components/project-sections/Products.vue'
import Expences from '@/components/project-sections/Expences.vue'
import Simulation from '@/components/project-sections/Simulation.vue'
import BusinessPlan from '@/components/project-sections/BusinessPlan.vue'

const tab = ref('pescription')
const items = [
  { value: 'pescription', text: 'Description', component: Project },
  { value: 'products', text: 'Products', component: Products },
  { value: 'expences', text: 'Expences', component: Expences },
  { value: 'simulation', text: 'Simulation', component: Simulation },
  { value: 'business_plan', text: 'Business Plan', component: BusinessPlan }
]
</script>

<style scoped>
.custom-tabs-window {
  border: none !important;
  box-shadow: none !important; /* Remove card shadow if needed */
}
#tab-project .v-card {
  background-color: #f3f4f6 !important;
  border: none !important;
}
#tab-project .v-card-text {
  padding: 0;
}
.custom-header {
  width: auto !important;
}
</style>
