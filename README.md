# samjin98.github.io

Personal site and blog, built with [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/).

Fully static, with no client-side framework. The only JavaScript on the page is the theme toggle.

## Development

Requires Node 22+ (see `.nvmrc`).

```sh
npm install
npm run dev      # start dev server
npm run build    # build to ./dist
npm run preview  # preview the production build
```

## Writing

Posts live in `src/content/blog/`, projects in `src/content/projects/`, as MDX files named `YYYY-MM-DD_slug.mdx`. The filename (minus extension) becomes the URL.

Resume data (experience, education) lives in `src/lib/data.ts`.

## Deployment

Pushes to `main` deploy to GitHub Pages via `.github/workflows/deploy.yml`.
