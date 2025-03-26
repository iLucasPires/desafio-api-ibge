import { execSync } from 'child_process'

export default defineNuxtConfig({
  compatibilityDate: "2025-03-25",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxt/test-utils",
    "nuxt-auth-utils",
  ],
  css: ["@/assets/css/main.css"],
  nitro: {
    experimental: {
      database: true,
      tasks: true,
    },
  },
  hooks: {
    'build:before': async () => {
      try {
        execSync('npx drizzle-kit migrate')
        console.log('Prisma generate done.')
      }
      catch (error) {
        console.error('Error in prisma generate:', error)
        process.exit(1)
      }
    },
  },
  runtimeConfig: {
    public: {
      apiPia: process.env.NUXT_API_PIA,
    },
    oauth: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },
  },
});
