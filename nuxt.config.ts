import { defineNuxtConfig } from 'nuxt/config'
import * as vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: true },
  plugins: [
    '~/plugins/hello.ts',
    '~/plugins/vue3-apexcharts.js',
    '~/plugins/vuetify.ts'
  ],
  runtimeConfig: {
    public: {
      baseApiUrl: process.env.BASE_API_URL // Ensure this is available on both client and server
    }
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/test-utils/module',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', config => {
        config.plugins.push(vuetify.default({ autoImport: true }))
      })
    }
  ],
  build: {
    transpile: ['vuetify']
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls: vuetify.transformAssetUrls
      }
    }
  },
  css: ['~/assets/css/main.css']
})
