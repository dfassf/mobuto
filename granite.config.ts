import { defineConfig } from '@apps-in-toss/web-framework/config'

const appName = process.env.INTOSS_APP_NAME || 'mobuto'
const webPort = Number(process.env.INTOSS_WEB_PORT || '5173')
const defaultIconUrl = 'https://mobuto.vercel.app/favicon-192.png'

export default defineConfig({
  appName,
  brand: {
    displayName: process.env.INTOSS_DISPLAY_NAME || '뭐부터',
    primaryColor: process.env.INTOSS_PRIMARY_COLOR || '#334155',
    icon: process.env.INTOSS_ICON_URL || defaultIconUrl,
  },
  web: {
    host: process.env.INTOSS_WEB_HOST || 'localhost',
    port: Number.isFinite(webPort) ? webPort : 5173,
    commands: {
      dev: 'vite',
      build: 'tsc -b && vite build',
    },
  },
  outdir: 'dist',
  permissions: [],
  webViewProps: {
    type: 'partner',
  },
})
