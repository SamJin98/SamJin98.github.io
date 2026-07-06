import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string())
  })
})

const projects = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.coerce.date(),
    github: z.url(),
    demoUrl: z.url().optional(),
    featured: z.boolean().optional(),
    tags: z.array(z.string()),
    image: z
      .string()
      .describe(
        'Path to the project image (relative to content/projects/resources/)'
      )
  })
})

export const collections = {
  blog,
  projects
}
