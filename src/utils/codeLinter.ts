import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';

const VOID_HTML_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

/**
 * Robust HTML / Tailwind CSS validator that checks for unclosed tags,
 * mismatched closing tags, unclosed quotes, and syntax errors.
 */
export function lintHtmlCode(view: EditorView): Diagnostic[] {
  const doc = view.state.doc;
  const text = doc.toString();
  const diagnostics: Diagnostic[] = [];

  if (!text || text.trim() === '') {
    return diagnostics;
  }

  // 1. Check for unclosed attribute quotes
  const quoteRegex = /<([a-zA-Z0-9\-]+)[^>]*?([a-zA-Z\-]+)=["']([^"']*)$/m;
  const lines = text.split('\n');
  let currentOffset = 0;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    // Check if line has unclosed attribute quote inside an unclosed tag
    if (line.includes('<') && (line.includes('class="') || line.includes('style="'))) {
      const doubleQuotes = (line.match(/"/g) || []).length;
      if (doubleQuotes % 2 !== 0 && !line.includes('>')) {
        diagnostics.push({
          from: currentOffset,
          to: Math.min(doc.length, currentOffset + line.length),
          severity: 'warning',
          message: `Line ${lineIdx + 1}: Possibly unclosed quote in attribute.`,
        });
      }
    }
    currentOffset += line.length + 1;
  }

  // 2. Stack-based tag balance validator
  interface OpenTag {
    tag: string;
    from: number;
    to: number;
    line: number;
  }

  const stack: OpenTag[] = [];
  // Match XML/HTML tags: comments <!-- -->, closing </tag>, open <tag ...> or <tag .../>
  const tagRegex = /<!--[\s\S]*?-->|<\/([a-zA-Z0-9\-]+)>|<([a-zA-Z0-9\-]+)([^>]*)(\/?)>/g;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(text)) !== null) {
    const fullMatch = match[0];
    const matchIndex = match.index;

    // Skip comments
    if (fullMatch.startsWith('<!--')) {
      continue;
    }

    const closingTagName = match[1];
    const openingTagName = match[2];
    const attributes = match[3] || '';
    const isSelfClosingSlash = match[4] === '/';

    if (closingTagName) {
      // Closing tag: </tag>
      const lowerClose = closingTagName.toLowerCase();
      if (stack.length === 0) {
        diagnostics.push({
          from: matchIndex,
          to: matchIndex + fullMatch.length,
          severity: 'error',
          message: `Unexpected closing tag </${closingTagName}> without matching open tag.`,
        });
      } else {
        const top = stack[stack.length - 1];
        if (top.tag.toLowerCase() === lowerClose) {
          stack.pop();
        } else {
          // Check if top was something else
          diagnostics.push({
            from: matchIndex,
            to: matchIndex + fullMatch.length,
            severity: 'error',
            message: `Mismatched closing tag </${closingTagName}>. Expected </${top.tag}> (opened on line ${top.line}).`,
          });
          // Pop to attempt recovery
          stack.pop();
        }
      }
    } else if (openingTagName) {
      // Opening tag: <tag ...>
      const lowerOpen = openingTagName.toLowerCase();
      const isVoid = VOID_HTML_TAGS.has(lowerOpen);
      const isSelfClosing = isSelfClosingSlash || isVoid || attributes.trim().endsWith('/');

      if (!isSelfClosing) {
        const lineNum = doc.lineAt(matchIndex).number;
        stack.push({
          tag: openingTagName,
          from: matchIndex,
          to: matchIndex + fullMatch.length,
          line: lineNum,
        });
      }
    }
  }

  // Any remaining tags on stack are unclosed
  for (const unclosed of stack) {
    diagnostics.push({
      from: unclosed.from,
      to: unclosed.to,
      severity: 'error',
      message: `Unclosed <${unclosed.tag}> tag opened on line ${unclosed.line}. Missing </${unclosed.tag}>.`,
    });
  }

  return diagnostics;
}

/**
 * JavaScript syntax validator for Canvas 2D / WebGL code.
 */
export function lintJsCode(view: EditorView): Diagnostic[] {
  const text = view.state.doc.toString();
  const diagnostics: Diagnostic[] = [];

  if (!text || text.trim() === '') {
    return diagnostics;
  }

  try {
    // Syntax check by creating function
    new Function('canvas', 'ctx', 'width', 'height', text);
  } catch (err: any) {
    const errorMsg = err?.message || 'JavaScript Syntax Error';
    let line = 1;
    let col = 1;

    // Attempt to extract line number from error message
    const lineMatch = errorMsg.match(/line\s+(\d+)/i) || err?.stack?.match(/<anonymous>:(\d+):(\d+)/);
    if (lineMatch) {
      line = parseInt(lineMatch[1], 10);
      col = lineMatch[2] ? parseInt(lineMatch[2], 10) : 1;
    }

    const doc = view.state.doc;
    const safeLineNum = Math.min(Math.max(1, line), doc.lines);
    const lineObj = doc.line(safeLineNum);

    diagnostics.push({
      from: lineObj.from,
      to: lineObj.to,
      severity: 'error',
      message: errorMsg,
    });
  }

  return diagnostics;
}
