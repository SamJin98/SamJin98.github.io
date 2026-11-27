// Turns the built site into redirect stubs for the old samjin98.github.io
// address. Every page keeps its path and forwards to samjin98.dev.
import { readdirSync, statSync, writeFileSync, rmSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const dist = process.argv[2] ?? 'dist'
const target = 'https://samjin98.dev'

const stub = (url) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Moved to samjin98.dev</title>
<link rel="canonical" href="${url}" />
<meta name="robots" content="noindex" />
<meta http-equiv="refresh" content="0; url=${url}" />
<script>location.replace(${JSON.stringify(target)} + location.pathname + location.search + location.hash)</script>
</head>
<body><p>This site moved to <a href="${url}">${url}</a>.</p></body>
</html>
`

const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else if (name.endsWith('.html')) {
      let path = '/' + relative(dist, p).split(sep).join('/')
      path = path.replace(/index\.html$/, '')
      writeFileSync(p, stub(target + path))
    }
  }
}

walk(dist)
// 404 page forwards any unknown path as-is.
writeFileSync(join(dist, '404.html'), stub(target + '/'))
for (const f of ['sitemap-index.xml', 'sitemap-0.xml']) rmSync(join(dist, f), { force: true })
