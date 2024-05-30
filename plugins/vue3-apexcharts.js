import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async nuxtApp => {
  if (process.client) {
    const VueApexCharts = (await import('vue3-apexcharts')).default
    nuxtApp.vueApp.use(VueApexCharts)
  }
})
