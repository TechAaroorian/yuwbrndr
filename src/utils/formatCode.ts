/**
 * Simple, robust HTML beautifier / formatter for clean indentation
 */
export function formatHtml(html: string): string {
  let tab = '  ';
  let result = '';
  let indent = 0;

  // Normalize spaces and clean up newlines around tags
  const tokens = html
    .replace(/>\s*</g, '><')
    .replace(/<(?:\/?)(?:[a-zA-Z0-9\-]+)[^>]*>/g, (m) => `\n${m}\n`)
    .split('\n')
    .filter((line) => line.trim().length > 0);

  const voidTags = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
    'link', 'meta', 'param', 'source', 'track', 'wbr'
  ]);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim();

    if (token.startsWith('<!--')) {
      // Comment
      result += tab.repeat(indent) + token + '\n';
    } else if (token.startsWith('</')) {
      // Closing tag
      indent = Math.max(0, indent - 1);
      result += tab.repeat(indent) + token + '\n';
    } else if (token.startsWith('<')) {
      // Check if self-closing or void tag
      const match = token.match(/^<([a-zA-Z0-9\-]+)/);
      const tagName = match ? match[1].toLowerCase() : '';
      const isSelfClosing = token.endsWith('/>') || voidTags.has(tagName);

      result += tab.repeat(indent) + token + '\n';
      if (!isSelfClosing) {
        indent++;
      }
    } else {
      // Text content inside tag
      result += tab.repeat(indent) + token + '\n';
    }
  }

  return result.trim();
}
