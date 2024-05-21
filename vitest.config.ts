import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    environmentOptions: {
      nuxt: {
        rootDir: './',
        mock: {
          intersectionObserver: true,
          indexedDb: true
        }
      }
    }
  },
  resolve: {
    alias: {
      '#imports': path.resolve(__dirname, '.nuxt/imports.d.ts'),
      '@': path.resolve(__dirname, 'src')
    }
  }
})
