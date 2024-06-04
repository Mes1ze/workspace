// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NODE_ENV === 'production' ? 'http://5.35.82.182:3000' : 'http://localhost:3000',
    }
  },
  build: {
    transpile:
      process.env.NODE_ENV === 'production'
        ? [
            'naive-ui',
            'vueuc',
            '@css-render/vue3-ssr',
            '@juggle/resize-observer'
          ]
        : ['@juggle/resize-observer']
  },
  vite: {
    optimizeDeps: {
      include:
        process.env.NODE_ENV === 'development'
          ? ['naive-ui', 'vueuc', 'date-fns-tz/formatInTimeZone']
          : []
    }
  },
  routeRules: { 
    '/admin/**': { ssr: false },
    '/api/**': { cors: true } 
  },
  debug: false,
  css: ['~/assets/css/base.css'],
  nitro: {
//    plugins: ['~/server/websocket-plugin.js']
    experimental: {
      websocket: true
    }
  }
})