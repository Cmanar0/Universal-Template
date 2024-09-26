interface ImportMetaEnv {
  readonly VITE_APP_BASE_API_URL: string
  readonly NUXT_PUBLIC_BASE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
