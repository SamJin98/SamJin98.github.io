// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import partytown from '@astrojs/partytown'
import { rehypePrettyCodeOptions } from './src/utils/rehype-pretty-code-config.js'

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
      syntaxHighlight: 'shiki',
      rehypePlugins: [rehypeSlug, [rehypePrettyCode, rehypePrettyCodeOptions]],
      remarkPlugins: [],
      extendMarkdownConfig: true
    }),
    sitemap(),
    partytown({
      config: {
        forward: ['dataLayer.push']
      }
    })
  ]
})
