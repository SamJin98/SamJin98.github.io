// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import partytown from '@astrojs/partytown'

import react from '@astrojs/react'

import mdx from '@astrojs/mdx'

export default defineConfig({
  site: 'https://samjin98.github.io/',
  // base: "/Portfolio/",
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    react(),
    mdx({
      syntaxHighlight: 'prism',
      rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: 'github-dark' }]]
    }),
    sitemap(),
    partytown({
      config: {
        forward: ['dataLayer.push']
      }
    })
  ]
})
