// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-09-07',
  devtools: { enabled: true },
  runtimeConfig: {
    databaseUrl: 'postgres://todo:todo@localhost:5432/todo'
  }
})
