// ~/plugins/vuetify.ts
import { defineNuxtPlugin } from '#imports'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const vuetify = createVuetify({
  ssr: true
})
export default defineNuxtPlugin((nuxtApp: any) => {
  const vuetify = createVuetify({
    components,
    directives
  })

  nuxtApp.vueApp.use(vuetify)
})
