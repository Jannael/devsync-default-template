// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import devsync, { defaultLang, languages } from './src/devsync/devsync'

import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  site: devsync.site,

  i18n: {
    defaultLocale: defaultLang,
    locales: languages,
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [sitemap()],
})
