// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
  ],

  typescript: {
    strict: true,
    typeCheck: true,
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'My Blog',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A personal blog built with Nuxt 3' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  runtimeConfig: {
    // Server-side only - these MUST be set via environment variables in production
    databaseHost: process.env.DB_HOST,
    databasePort: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    databaseUser: process.env.DB_USER,
    databasePassword: process.env.DB_PASSWORD,
    databaseName: process.env.DB_NAME,
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE) : 10485760,
    // Public
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  nitro: {
    experimental: {
      tasks: true,
    },
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  icon: {
    serverBundle: 'auto',
  },

  i18n: {
    locales: [
      {
        code: 'zh',
        name: '中文',
        file: 'zh.json',
      },
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
      },
    ],
    defaultLocale: 'zh',
    lazy: true,
    langDir: 'locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    compilation: {
      strictMessage: false,
    },
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },
})
