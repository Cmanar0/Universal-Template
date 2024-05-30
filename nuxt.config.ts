import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  plugins: ['~/plugins/hello.ts', '~/plugins/vue3-apexcharts.js'],
  runtimeConfig: {
    public: {
      baseApiUrl: process.env.BASE_API_URL // Ensure this is available on both client and server
    }
  },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxt/test-utils/module'],
  css: ['~/assets/css/main.css']
})
