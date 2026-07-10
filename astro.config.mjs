// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'
import { satteri } from '@astrojs/markdown-satteri'
import temmlMath from './src/lib/temml-math.js'

export default defineConfig({
  site: 'https://samjin98.github.io/',
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    // Sätteri (Astro's default Rust engine) with native math parsing on;
    // temmlMath renders the math nodes to MathML. Shiki dual-theme code
    // highlighting still applies via shikiConfig below.
    processor: satteri({
      features: { math: true },
      mdastPlugins: [temmlMath]
    }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      }
    }
  },
  integrations: [mdx(), sitemap()]
})
