import { resolve } from 'path'
import { createCommonJS } from 'mlly'
const { __dirname } = createCommonJS(import.meta.url)

export default defineNuxtConfig({
  runtimeConfig: {
    JWT_KEY: '',
    DB_URL: '',
    DB_AUTH_TOKEN: '',
    S3_ENDPOINT: '',
    S3_ACCESS_KEY_ID: '',
    S3_SECRET_ACCESS_KEY: '',
    public: {
    },
  },
  nitro: {
    preset: 'cloudflare-pages',
    experimental: {
      openAPI: true
    },
    // node: true,
  },
  imports: {
    presets: [{
      from: '@tanstack/vue-query',
      imports: ['useMutation']
    }]
  },
  vite: {
    define: {
      global: {},
    },
  },
  app: {
    head: {
      title: 'DistApp',
      // link: [
      //   {
      //     id: 'theme-css',
      //     rel: 'stylesheet',
      //     type: 'text/css',
      //     href: '/themes/aura-dark-green/theme.css'
      //   }
      // ]
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ['@hebilicious/vue-query-nuxt', 'nuxt-primevue', '@pinia/nuxt'],
  primevue: {
    options: { ripple: true },
    components: {
      exclude: ['Editor']
    }
  },
  auth: { provider: { type: 'local' } },
  css: ['~/assets/css/main.css', 'primeicons/primeicons.css', 'primeflex/primeflex.scss', 'primevue/resources/primevue.min.css', '@/assets/styles.scss'],
  hooks: {
    'pages:extend'(pages) {
      pages.push({
        name: 'orgs',
        path: '/orgs/:orgName',
        file: resolve(__dirname, 'pages/apps.vue'),
      })
    }
  }
})