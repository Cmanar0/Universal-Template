// ~/plugins/vuetify.ts
import { defineNuxtPlugin } from '#imports'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    // Add your Vuetify configuration here
  })
  nuxtApp.vueApp.use(vuetify)
})
