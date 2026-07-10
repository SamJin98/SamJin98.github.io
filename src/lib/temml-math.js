import temml from 'temml'

// Sätteri parses `$...$` / `$$...$$` into mdast `inlineMath` / `math` nodes
// (features.math). This plugin renders each to MathML at build time via Temml,
// so pages ship zero math runtime — the browser renders the MathML natively.
function render(latex, displayMode) {
  try {
    return temml.renderToString(latex, { displayMode, throwOnError: false })
  } catch {
    return `<code class="math-error">${latex}</code>`
  }
}

export default {
  name: 'temml-math',
  math(node, ctx) {
    ctx.replaceNode(node, { rawHtml: render(node.value, true) })
  },
  inlineMath(node, ctx) {
    ctx.replaceNode(node, { rawHtml: render(node.value, false) })
  }
}
