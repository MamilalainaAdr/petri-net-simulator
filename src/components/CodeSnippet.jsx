/**
 * Petit composant d'affichage de code avec coloration syntaxique basique.
 * Suffisant pour la landing page (pas de dépendance externe).
 */
const TOKEN_PATTERNS = [
  { type: 'comment', regex: /(#.*|\/\/.*)/g },
  { type: 'keyword', regex: /\b(const|let|var|function|return|if|else|for|while|import|from|export|default|class|new|async|await|of|in|=>)\b/g },
  { type: 'string', regex: /("[^"]*"|'[^']*'|`[^`]*`)/g },
  { type: 'number', regex: /\b(\d+(\.\d+)?)\b/g },
  { type: 'punctuation', regex: /([{}()[\];,.:=+\-*/<>!&|?])/g },
]

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]))
}

function highlight(code) {
  // Marqueurs temporaires pour éviter les collisions entre règles.
  const tokens = []
  let html = escapeHtml(code)

  TOKEN_PATTERNS.forEach(({ type, regex }) => {
    html = html.replace(regex, (match) => {
      const id = `\u0000${tokens.length}\u0000`
      tokens.push({ type, value: match })
      return id
    })
  })

  tokens.forEach((tok, i) => {
    html = html.replace(
      new RegExp(`\\u0000${i}\\u0000`, 'g'),
      `<span class="tok tok--${tok.type}">${tok.value}</span>`
    )
  })

  return html
}

export default function CodeSnippet({ code, language = 'javascript' }) {
  return (
    <pre className={`code-snippet language-${language}`}>
      <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
    </pre>
  )
}