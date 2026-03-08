/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INTOSS_APP_NAME?: string
  readonly VITE_AD_INTERSTITIAL_ID?: string
  readonly VITE_AD_REWARDED_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
