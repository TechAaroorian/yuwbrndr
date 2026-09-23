import { describe, it, expect } from 'vitest';
import { lintHtmlCode, lintJsCode } from './codeLinter';
import type { EditorView } from '@codemirror/view';

function createMockView(text: string): EditorView {
  const lines = text.split('\n');
  const lineOffsets: { from: number; to: number; number: number }[] = [];
  let cur = 0;
  for (let i = 0; i < lines.length; i++) {
    const from = cur;
    const to = cur + lines[i].length;
    lineOffsets.push({ from, to, number: i + 1 });
    cur = to + 1;
  }

  return {
    state: {
      doc: {
        toString: () => text,
        length: text.length,
        lines: lines.length,
        lineAt: (pos: number) => {
          const found = lineOffsets.find((lo) => pos >= lo.from && pos <= lo.to);
          return found || lineOffsets[0] || { from: 0, to: 0, number: 1 };
        },
        line: (num: number) => {
          return lineOffsets[num - 1] || lineOffsets[0] || { from: 0, to: 0, number: 1 };
        },
      },
    },
  } as unknown as EditorView;
}

describe('codeLinter utility', () => {
  describe('lintHtmlCode', () => {
    it('should return 0 diagnostics for empty or whitespace-only code', () => {
      const view1 = createMockView('');
      expect(lintHtmlCode(view1)).toEqual([]);

      const view2 = createMockView('   \n  \n');
      expect(lintHtmlCode(view2)).toEqual([]);
    });

    it('should return 0 diagnostics for well-formed balanced HTML', () => {
      const html = `<div class="p-8 bg-slate-900">\n  <h1 class="text-3xl text-white">Title</h1>\n  <p>Description</p>\n</div>`;
      const view = createMockView(html);
      expect(lintHtmlCode(view)).toEqual([]);
    });

    it('should handle void self-closing tags without errors', () => {
      const html = `<div>\n  <img src="pic.png" alt="test" />\n  <br>\n  <hr>\n  <input type="text">\n</div>`;
      const view = createMockView(html);
      expect(lintHtmlCode(view)).toEqual([]);
    });

    it('should report an error for an unclosed HTML tag', () => {
      const html = `<div class="container">\n  <h2>Heading</h2>\n`;
      const view = createMockView(html);
      const diags = lintHtmlCode(view);

      expect(diags.length).toBeGreaterThan(0);
      expect(diags[0].severity).toBe('error');
      expect(diags[0].message).toContain('Unclosed <div> tag');
    });

    it('should report an error for unexpected closing tag without open tag', () => {
      const html = `<span>Text</span>\n</div>`;
      const view = createMockView(html);
      const diags = lintHtmlCode(view);

      expect(diags.length).toBeGreaterThan(0);
      expect(diags[0].severity).toBe('error');
      expect(diags[0].message).toContain('Unexpected closing tag </div>');
    });

    it('should report an error for mismatched tags', () => {
      const html = `<div>\n  <span>Content</div>\n</span>`;
      const view = createMockView(html);
      const diags = lintHtmlCode(view);

      expect(diags.length).toBeGreaterThan(0);
      expect(diags[0].severity).toBe('error');
      expect(diags[0].message).toContain('Mismatched closing tag');
    });
  });

  describe('lintJsCode', () => {
    it('should return 0 diagnostics for valid JavaScript canvas code', () => {
      const js = `ctx.fillStyle = "#ffffff";\nctx.fillRect(0, 0, width, height);\nconsole.log(canvas);`;
      const view = createMockView(js);
      expect(lintJsCode(view)).toEqual([]);
    });

    it('should report a diagnostic for syntax errors in JavaScript code', () => {
      const js = `const a = ; // syntax error`;
      const view = createMockView(js);
      const diags = lintJsCode(view);

      expect(diags.length).toBe(1);
      expect(diags[0].severity).toBe('error');
    });
  });
});
