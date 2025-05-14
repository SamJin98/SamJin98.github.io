/**
 * Custom configuration for rehype-pretty-code
 * Used for syntax highlighting in MDX files
 */

export const rehypePrettyCodeOptions = {
  // Use GitHub's theme that works well in both light and dark modes
  theme: 'github-dark',

  // Keep code block background consistent
  keepBackground: true,

  // Enable grid for better line number support
  grid: true,

  // Generate line numbers
  lineNumbers: true,

  // Custom filter for code blocks - can be modified according to needs
  filterMetaString: meta => meta.replace(/language-/, ''),

  // Add language name as text on top
  onVisitLine(node) {
    // Add line highlight
    if (node.properties.className?.includes('highlight')) {
      node.properties.className = ['highlight-line']
    }
  },

  // Line highlight styling
  onVisitHighlightedLine(node) {
    node.properties.className = ['highlight-line']
  },

  // Add language name to code block
  onMetaData(meta) {
    // Add language display if needed
    return meta
  }
}
