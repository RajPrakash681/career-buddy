/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADZUNA_API_KEY: string
  readonly VITE_ADZUNA_APP_ID: string
  readonly VITE_ADZUNA_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}