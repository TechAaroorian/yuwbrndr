import React, { useState, useMemo, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import { linter, lintGutter, Diagnostic } from '@codemirror/lint';
import { 
  Code2, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  AlignLeft, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  WrapText, 
  PlusCircle, 
  FolderOpen,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { formatHtml } from '../utils/formatCode';
import { CODE_PRESETS, CodePreset } from '../utils/codePresets';
import { lintHtmlCode, lintJsCode } from '../utils/codeLinter';
import { UploadedAsset } from '../types/studio';

export type EditorDockMode = 'sidebar' | 'bottom' | 'split' | 'fullscreen';

interface Props {
  codeType: 'html' | 'canvas';
  setCodeType: React.Dispatch<React.SetStateAction<'html' | 'canvas'>>;
  code: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onLoadSample: (type: 'html' | 'canvas') => void;
  dockMode?: EditorDockMode;
  onDockModeChange?: (mode: EditorDockMode) => void;
  userImage?: string | null;
  uploadedAssets?: UploadedAsset[];
  onInsertImage?: (url: string) => void;
  height?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isWide?: boolean;
  onToggleWide?: () => void;
}

export const FullCodeEditor: React.FC<Props> = ({
  codeType,
  setCodeType,
  code,
  onChange,
  onClear,
  onLoadSample,
  dockMode,
  onDockModeChange,
  userImage,
  uploadedAssets = [],
  onInsertImage,
  height = '100%',
  isCollapsed,
  onToggleCollapse,
  isWide,
  onToggleWide,
}) => {
  const [fontSize, setFontSize] = useState<number>(13);
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [showPresets, setShowPresets] = useState<boolean>(false);
  const [showSnippets, setShowSnippets] = useState<boolean>(false);
  const [diagnosticsCount, setDiagnosticsCount] = useState<number>(0);

  // Linting callback that safely updates our local count for the status pill
  const handleLintHtml = useCallback((view: EditorView): Diagnostic[] => {
    const diags = lintHtmlCode(view);
    setTimeout(() => setDiagnosticsCount(diags.length), 0);
    return diags;
  }, []);

  const handleLintJs = useCallback((view: EditorView): Diagnostic[] => {
    const diags = lintJsCode(view);
    setTimeout(() => setDiagnosticsCount(diags.length), 0);
    return diags;
  }, []);

  // Extensions based on language, linting, and visual settings
  const extensions = useMemo(() => {
    const list = [];

    // Language mode + Linting
    if (codeType === 'html') {
      list.push(html({ autoCloseTags: true, matchClosingTags: true }));
      list.push(linter(handleLintHtml, { delay: 350 }));
    } else {
      list.push(javascript({ jsx: true }));
      list.push(linter(handleLintJs, { delay: 350 }));
    }

    // Gutter error/warning markers
    list.push(lintGutter());

    // Soft word wrap
    if (wordWrap) {
      list.push(EditorView.lineWrapping);
    }

    // Enhanced Vibrant Dark Theme with High-Contrast Syntax Highlighting
    list.push(
      EditorView.theme({
        '&': {
          fontSize: `${fontSize}px`,
          backgroundColor: '#060710 !important',
        },
        '.cm-gutters': {
          backgroundColor: '#04050b !important',
          color: '#475569 !important',
          borderRight: '1px solid rgba(255, 255, 255, 0.08) !important',
        },
        '.cm-activeLine': {
          backgroundColor: 'rgba(99, 102, 241, 0.09) !important',
        },
        '.cm-activeLineGutter': {
          backgroundColor: 'rgba(99, 102, 241, 0.18) !important',
          color: '#818cf8 !important',
        },
        '.cm-cursor': {
          borderLeftColor: '#38bdf8 !important',
          borderLeftWidth: '2px !important',
        },
        '.cm-selectionBackground': {
          backgroundColor: 'rgba(99, 102, 241, 0.35) !important',
        },
        // Tag names (div, span, h1, etc.)
        '.cm-tag, .tok-tag': {
          color: '#38bdf8 !important',
          fontWeight: '600',
        },
        // Attribute names (class, style, src, id)
        '.cm-attribute, .tok-attributeName': {
          color: '#c084fc !important',
        },
        // Strings & Tailwind class values
        '.cm-string, .tok-string': {
          color: '#34d399 !important',
        },
        // Comments
        '.cm-comment, .tok-comment': {
          color: '#64748b !important',
          fontStyle: 'italic',
        },
        // Numbers and Keywords
        '.tok-keyword, .cm-keyword': {
          color: '#f43f5e !important',
        },
        '.tok-number, .cm-number': {
          color: '#fb923c !important',
        },
        // Lint squiggly markers
        '.cm-lintRange-error': {
          backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='6' height='3'%3E<path d='m0 2.5 l3 -2 l3 2' stroke='%23f43f5e' fill='none' stroke-width='1.2'/></svg>") !important`,
        },
        '.cm-lintRange-warning': {
          backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='6' height='3'%3E<path d='m0 2.5 l3 -2 l3 2' stroke='%23fbbf24' fill='none' stroke-width='1.2'/></svg>") !important`,
        },
        '.cm-lintGutter-error': {
          color: '#f43f5e !important',
        },
        '.cm-lintGutter-warning': {
          color: '#fbbf24 !important',
        },
      })
    );

    return list;
  }, [codeType, wordWrap, fontSize, handleLintHtml, handleLintJs]);

  // Copy code to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Format code handler
  const handleFormat = () => {
    if (codeType === 'html') {
      try {
        const formatted = formatHtml(code);
        onChange(formatted);
      } catch (err) {
        console.error('Failed to format HTML', err);
      }
    }
  };

  // Insert snippet at the end or wrap
  const handleInsertSnippet = (snippet: string) => {
    if (!code || code.trim() === '') {
      onChange(snippet);
    } else {
      onChange(code + '\n' + snippet);
    }
    setShowSnippets(false);
  };

  // Load selected preset
  const handleSelectPreset = (preset: CodePreset) => {
    setCodeType(preset.type);
    onChange(preset.code);
    setShowPresets(false);
  };

  const lineCount = useMemo(() => {
    return code ? code.split('\n').length : 0;
  }, [code]);

  return (
    <div className="flex flex-col h-full w-full bg-[#060710] border-l border-white/10 overflow-hidden shadow-2xl select-none">
      {/* TOP HEADER TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-[#090b17] border-b border-white/10 text-xs">
        {/* Left: Engine Switcher & Presets */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-black/50 p-0.5 rounded-lg border border-white/10">
            <button
              onClick={() => setCodeType('html')}
              className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold transition-all ${
                codeType === 'html'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              HTML / Tailwind
            </button>
            <button
              onClick={() => setCodeType('canvas')}
              className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold transition-all ${
                codeType === 'canvas'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Canvas JS
            </button>
          </div>

          {/* Quick Snippets Inserter */}
          {codeType === 'html' && (
            <div className="relative">
              <button
                onClick={() => setShowSnippets(!showSnippets)}
                className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 text-[11px] font-medium transition-all"
                title="Insert Ready-made UI Components"
              >
                <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Add Element</span>
              </button>

              {showSnippets && (
                <div className="absolute top-full left-0 mt-1.5 w-60 bg-[#0f1325] border border-white/15 rounded-xl shadow-2xl p-1.5 z-50 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-500 font-bold border-b border-white/10">
                    Quick Components
                  </div>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `<div class="grid grid-cols-2 gap-4 my-4">\n  <div class="p-4 rounded-xl bg-slate-900/80 border border-white/10">\n    <h3 class="font-bold text-white">Left Column</h3>\n  </div>\n  <div class="p-4 rounded-xl bg-slate-900/80 border border-white/10">\n    <h3 class="font-bold text-white">Right Column</h3>\n  </div>\n</div>`
                      )
                    }
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-xs text-slate-300 hover:text-white"
                  >
                    📦 2-Column Grid
                  </button>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `<span class="px-3 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">⚡ Feature Badge</span>`
                      )
                    }
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-xs text-slate-300 hover:text-white"
                  >
                    🏷️ Status / Feature Badge
                  </button>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `<div class="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-3">\n  <span class="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold text-sm flex items-center justify-center shrink-0">1</span>\n  <span class="text-sm font-semibold text-slate-200">Point description here</span>\n</div>`
                      )
                    }
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-xs text-slate-300 hover:text-white"
                  >
                    🔢 Numbered Step Item
                  </button>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `<div class="p-4 rounded-xl bg-slate-900/90 border border-white/10 text-center shadow-lg">\n  <p class="text-sm font-medium text-slate-300">\n    Key Takeaway: <span class="text-cyan-300 font-bold">Important takeaway sentence here.</span>\n  </p>\n</div>`
                      )
                    }
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-xs text-slate-300 hover:text-white"
                  >
                    💡 Key Takeaway Box
                  </button>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `<div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none"></div>`
                      )
                    }
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-xs text-slate-300 hover:text-white"
                  >
                    ✨ Ambient Glow Blur
                  </button>

                  <div className="px-2 pt-2 pb-1 text-[10px] font-mono uppercase text-cyan-400 font-bold border-t border-white/10">
                    Typography Headings
                  </div>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `<h2 class="font-jakarta text-3xl font-extrabold text-white tracking-tight">Next-Gen Developer Platform</h2>`
                      )
                    }
                    className="w-full text-left p-1.5 rounded-lg hover:bg-white/5 text-xs text-slate-300 hover:text-white flex items-center justify-between"
                  >
                    <span>🚀 Modern Tech (Jakarta)</span>
                    <span className="text-[10px] font-mono text-slate-500">.font-jakarta</span>
                  </button>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `<h2 class="font-space text-3xl font-bold uppercase tracking-wider text-cyan-400">DECENTRALIZED PROTOCOL</h2>`
                      )
                    }
                    className="w-full text-left p-1.5 rounded-lg hover:bg-white/5 text-xs text-slate-300 hover:text-white flex items-center justify-between"
                  >
                    <span>⚡ Cyber / Web3 (Space)</span>
                    <span className="text-[10px] font-mono text-slate-500">.font-space</span>
                  </button>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `<blockquote class="font-playfair text-2xl italic text-slate-200 border-l-2 border-indigo-400 pl-4 my-2">“Simplicity is prerequisite for reliability.”</blockquote>`
                      )
                    }
                    className="w-full text-left p-1.5 rounded-lg hover:bg-white/5 text-xs text-slate-300 hover:text-white flex items-center justify-between"
                  >
                    <span>📰 Editorial Quote (Playfair)</span>
                    <span className="text-[10px] font-mono text-slate-500">.font-playfair</span>
                  </button>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `<h1 class="font-bebas text-5xl tracking-wide text-white uppercase meme-text-stroke">10X PERFORMANCE MULTIPLIER</h1>`
                      )
                    }
                    className="w-full text-left p-1.5 rounded-lg hover:bg-white/5 text-xs text-slate-300 hover:text-white flex items-center justify-between"
                  >
                    <span>📢 Punchy Poster (Bebas)</span>
                    <span className="text-[10px] font-mono text-slate-500">.font-bebas</span>
                  </button>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `<h2 class="font-cinzel text-2xl font-bold uppercase tracking-widest text-amber-300">HONORIS CAUSA</h2>`
                      )
                    }
                    className="w-full text-left p-1.5 rounded-lg hover:bg-white/5 text-xs text-slate-300 hover:text-white flex items-center justify-between"
                  >
                    <span>🏛️ Classical Serif (Cinzel)</span>
                    <span className="text-[10px] font-mono text-slate-500">.font-cinzel</span>
                  </button>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `<h2 class="font-syne text-3xl font-black text-white tracking-tight">CREATIVE INTELLIGENCE</h2>`
                      )
                    }
                    className="w-full text-left p-1.5 rounded-lg hover:bg-white/5 text-xs text-slate-300 hover:text-white flex items-center justify-between"
                  >
                    <span>🎨 Avant-Garde (Syne)</span>
                    <span className="text-[10px] font-mono text-slate-500">.font-syne</span>
                  </button>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `<div class="font-comic p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-200">\n  <h2 class="text-3xl font-black text-white">"It works on my machine!" 🤷‍♂️</h2>\n  <p class="text-base font-bold mt-1 text-slate-200">Then we will ship your laptop to the client!</p>\n</div>`
                      )
                    }
                    className="w-full text-left p-1.5 rounded-lg hover:bg-white/5 text-xs text-slate-300 hover:text-white flex items-center justify-between"
                  >
                    <span>🤪 Funny Comic (Comic Neue)</span>
                    <span className="text-[10px] font-mono text-slate-500">.font-comic</span>
                  </button>
                  {uploadedAssets.length > 0 && onInsertImage ? (
                    <div className="pt-1 border-t border-white/10 space-y-1">
                      <div className="px-2 py-0.5 text-[10px] font-mono uppercase text-indigo-400 font-bold">
                        Uploaded Assets ({uploadedAssets.length}/5)
                      </div>
                      {uploadedAssets.map((asset) => (
                        <button
                          key={asset.id}
                          onClick={() => {
                            onInsertImage(asset.url);
                            setShowSnippets(false);
                          }}
                          className="w-full text-left p-1.5 rounded-lg hover:bg-emerald-500/20 text-xs text-emerald-300 font-medium truncate flex items-center gap-1.5"
                          title={`Insert ${asset.name}`}
                        >
                          <img src={asset.url} alt="" className="w-3.5 h-3.5 rounded object-cover shrink-0 border border-emerald-500/30" />
                          <span className="truncate">Insert: {asset.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : userImage && onInsertImage ? (
                    <button
                      onClick={() => {
                        onInsertImage(userImage);
                        setShowSnippets(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-emerald-500/20 text-xs text-emerald-300 font-medium"
                    >
                      🖼️ Insert Uploaded Image
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Formatting, Tools & Width Adjusters */}
        <div className="flex items-center gap-1.5">
          {/* Format HTML button */}
          {codeType === 'html' && (
            <button
              onClick={handleFormat}
              className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
              title="Auto-format HTML Indentation"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Word Wrap Toggle */}
          <button
            onClick={() => setWordWrap(!wordWrap)}
            className={`p-1.5 rounded-lg border transition-all ${
              wordWrap
                ? 'border-indigo-500/50 bg-indigo-500/20 text-indigo-300'
                : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
            }`}
            title={wordWrap ? 'Word Wrap: ON' : 'Word Wrap: OFF'}
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>

          {/* Font Size Adjusters */}
          <div className="flex items-center border border-white/10 rounded-lg bg-black/40 p-0.5">
            <button
              onClick={() => setFontSize((s) => Math.max(11, s - 1))}
              className="p-1 hover:text-white text-slate-400"
              title="Decrease Font Size"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-mono px-1 text-slate-400">{fontSize}px</span>
            <button
              onClick={() => setFontSize((s) => Math.min(20, s + 1))}
              className="p-1 hover:text-white text-slate-400"
              title="Increase Font Size"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          {/* Copy Code */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
            title="Copy Code to Clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Clear Code */}
          <button
            onClick={onClear}
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-rose-500/20 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-all"
            title="Clear canvas"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Width Expand / Fullscreen Toggle */}
          {onToggleWide && (
            <button
              onClick={onToggleWide}
              className={`p-1.5 rounded-lg border transition-all ${
                isWide
                  ? 'border-indigo-500/50 bg-indigo-500/20 text-indigo-300'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
              }`}
              title={isWide ? 'Restore Normal Width (520px)' : 'Expand Editor Width (680px)'}
            >
              {isWide ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Collapse/Hide Panel button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all ml-0.5"
              title="Collapse Editor Panel"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* MAIN CODEMIRROR WORKBENCH AREA */}
      <div className="flex-1 min-h-0 relative overflow-hidden">
        <CodeMirror
          value={code}
          height="100%"
          theme={oneDark}
          extensions={extensions}
          onChange={(val) => onChange(val)}
          placeholder={
            codeType === 'html'
              ? '<!-- Type or paste HTML / Tailwind code here -->\n<div class="w-full h-full p-8 bg-slate-900 text-white flex flex-col justify-center items-center">\n  <h1 class="text-4xl font-extrabold text-cyan-400">Design Title</h1>\n  <p class="text-slate-400 mt-2">Adjust content, colors, and layout in real-time...</p>\n</div>'
              : '// Canvas 2D Code (canvas, ctx, width, height are available)\nctx.fillStyle = "#090a10";\nctx.fillRect(0, 0, width, height);\n\nctx.fillStyle = "#38bdf8";\nctx.font = "bold 36px Inter, sans-serif";\nctx.fillText("Dynamic Canvas", 60, 100);'
          }
          className="h-full font-mono text-sm overflow-auto"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: true,
            autocompletion: true,
            bracketMatching: true,
            closeBrackets: true,
            history: true,
            tabSize: 2,
          }}
        />
      </div>

      {/* BOTTOM STATUS & LINTING DIAGNOSTICS BAR */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#04050b] border-t border-white/10 text-[11px] font-mono text-slate-400 select-none">
        <div className="flex items-center gap-3">
          {/* Real-time Lint Diagnostic Status */}
          {diagnosticsCount === 0 ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Syntax Valid</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-rose-400 font-semibold animate-pulse">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>{diagnosticsCount} Syntax {diagnosticsCount === 1 ? 'Issue' : 'Issues'}</span>
            </span>
          )}

          <span className="text-slate-600">|</span>
          <span>{lineCount} lines</span>
          <span>{code.length} chars</span>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <span>Tab: 2sp</span>
          <span>UTF-8</span>
          <span className="text-indigo-400 font-semibold">{codeType.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
