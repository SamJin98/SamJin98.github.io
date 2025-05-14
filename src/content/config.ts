import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      date: z.coerce.date(),
      //   cover: image(),
      tags: z.array(z.string())
    })
})

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      date: z.coerce.date(),
      github: z.string().url(),
      demoUrl: z.string().url().optional(),
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
