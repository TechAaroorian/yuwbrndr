import React, { useState, useMemo, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { EditorView } from '@codemirror/view';
import { linter, lintGutter, Diagnostic } from '@codemirror/lint';
import { 
  Code2, 
  Bot,
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
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { formatHtml } from '../utils/formatCode';
import { lintHtmlCode, lintJsCode } from '../utils/codeLinter';
import { UploadedAsset } from '../types/studio';

interface Props {
  codeType: 'html' | 'canvas';
  setCodeType: (type: 'html' | 'canvas') => void;
  code: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onLoadSample: (type: 'html' | 'canvas') => void;
  userImage?: string | null;
  uploadedAssets?: UploadedAsset[];
  onInsertImage?: (url: string) => void;
  onToggleCollapse?: () => void;
  isWide?: boolean;
  onToggleWide?: () => void;
  onOpenAiPrompt?: () => void;
}

export const FullCodeEditor: React.FC<Props> = ({
  codeType,
  setCodeType,
  code,
  onChange,
  onClear,
  onLoadSample,
  userImage,
  uploadedAssets = [],
  onInsertImage,
  onToggleCollapse,
  isWide,
  onToggleWide,
  onOpenAiPrompt,
}) => {
  const [fontSize, setFontSize] = useState<number>(13);
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
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
    list.push(syntaxHighlighting(HighlightStyle.define([
      { tag: [tags.keyword, tags.tagName], class: 'aar-syntax-keyword' },
      { tag: [tags.string, tags.attributeValue], class: 'aar-syntax-string' },
      { tag: [tags.comment], class: 'aar-syntax-comment' },
      { tag: [tags.number, tags.attributeName], class: 'aar-syntax-value' },
    ])));


    // Soft word wrap
    if (wordWrap) {
      list.push(EditorView.lineWrapping);
    }



    return list;
  }, [codeType, wordWrap, handleLintHtml, handleLintJs]);

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

  const lineCount = useMemo(() => {
    return code ? code.split('\n').length : 0;
  }, [code]);

  return (
    <div style={{ '--aar-editor-font-size': `${fontSize}px` } as React.CSSProperties} className="aar-editor-codemirror aar-u-flex aar-u-flex-col aar-u-h-full aar-u-w-full aar-u-bg-surface aar-u-overflow-hidden aar-u-select-none">
      {/* MOBILE EXPANDED FULLSCREEN BAR (only show editor with minimize option on mobile) */}
      {isWide && (
        <div className="aar-u-lg-hidden aar-u-flex aar-u-items-center aar-u-justify-between aar-u-px-4 aar-u-py-2.5 aar-u-bg-background aar-u-border-b aar-u-border-border aar-u-select-none aar-u-shrink-0">
          <div className="aar-toolbar-group">
            <span className="aar-u-w-2 aar-u-h-2 aar-u-rounded-full aar-u-bg-indigo-500 aar-u-animate-pulse" />
            <span className="aar-u-font-mono aar-u-text-xs aar-u-font-semibold aar-u-text-text">
              {codeType === 'html' ? 'HTML + CSS' : 'Canvas JS'} Editor
            </span>
          </div>

          <button
            onClick={onToggleWide}
            className="aar-button aar-u-flex aar-u-gap-1.5" data-variant="primary"
            title="Minimize Editor" data-size="sm"
          >
            <Minimize2 className="aar-u-w-3.5 aar-u-h-3.5" />
            <span>Minimize</span>
          </button>
        </div>
      )}

      {/* TOP HEADER TOOLBAR (Hidden on mobile when expanded) */}
      <div className={`aar-u-flex aar-u-flex-wrap aar-u-items-center aar-u-justify-between aar-u-gap-2 aar-u-px-3 aar-u-py-1.5 aar-u-bg-surface-subtle aar-u-text-xs aar-u-shrink-0 ${
        isWide ? 'aar-u-hidden aar-u-lg-flex' : 'aar-u-flex'
      }`}>
        {/* Left: Engine Switcher & Presets */}
        <div className="aar-toolbar-group aar-editor-commands">
          <div className="aar-segmented" aria-label="Code language">
            <button
              onClick={() => setCodeType('html')} aria-pressed={codeType === 'html'}
              className="aar-segmented-item" data-size="sm"
            >
              HTML + CSS
            </button>
            <button
              onClick={() => setCodeType('canvas')} aria-pressed={codeType === 'canvas'}
              className="aar-segmented-item" data-size="sm"
            >
              Canvas JS · Advanced
            </button>
          </div>

          {/* AI Prompt Generator */}
          {onOpenAiPrompt && (
            <button
              onClick={onOpenAiPrompt}
              className="aar-button aar-u-flex aar-u-gap-1.5"
              data-variant="ai"
              data-size="sm"
              title="Generate AI Prompt for Design Code (ChatGPT, Claude, etc.)"
            >
              <Sparkles className="aar-u-w-3.5 aar-u-h-3.5" />
              <span className="aar-u-hidden aar-u-sm-inline">AI Prompt</span>
            </button>
          )}

          {/* Quick Snippets Inserter */}
          {codeType === 'html' && (
            <div className="aar-u-relative">
              <button
                onClick={() => setShowSnippets(!showSnippets)}
                className="aar-button aar-u-flex aar-u-gap-1.5"
                title="Insert Ready-made UI Components" data-size="sm"
              >
                <PlusCircle className="aar-u-w-3.5 aar-u-h-3.5 aar-text-muted" />
                <span className="aar-u-hidden aar-u-sm-inline">Add Element</span>
              </button>

              {showSnippets && (
                <div className="aar-u-absolute aar-u-top-full aar-u-left-0 aar-u-mt-1.5 aar-u-w-60 aar-u-bg-surface aar-u-border aar-u-border-border aar-u-rounded  aar-u-p-1.5 aar-u-z-50 aar-u-space-y-1">
                  <div className="aar-u-px-2 aar-u-py-1 aar-u-text-xs aar-u-font-mono aar-u-uppercase aar-u-text-text-muted aar-u-font-bold aar-u-border-b aar-u-border-border">
                    Quick Components
                  </div>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `<div class="grid grid-cols-2 gap-4 my-4">\n  <div class="p-4 rounded-xl bg-slate-900/80 border border-white/10">\n    <h3 class="font-bold text-white">Left Column</h3>\n  </div>\n  <div class="p-4 rounded-xl bg-slate-900/80 border border-white/10">\n    <h3 class="font-bold text-white">Right Column</h3>\n  </div>\n</div>`
                      )
                    }
                    className="aar-button aar-u-w-full" data-size="sm"
                  >
                    📦 2-Column Grid
                  </button>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `<span class="px-3 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">⚡ Feature Badge</span>`
                      )
                    }
                    className="aar-button aar-u-w-full" data-size="sm"
                  >
                    🏷️ Status / Feature Badge
                  </button>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `<div class="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-3">\n  <span class="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold text-sm flex items-center justify-center shrink-0">1</span>\n  <span class="text-sm font-semibold text-slate-200">Point description here</span>\n</div>`
                      )
                    }
                    className="aar-button aar-u-w-full" data-size="sm"
                  >
                    🔢 Numbered Step Item
                  </button>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `<div class="p-4 rounded-xl bg-slate-900/90 border border-white/10 text-center shadow-lg">\n  <p class="text-sm font-medium text-slate-300">\n    Key Takeaway: <span class="text-cyan-300 font-bold">Important takeaway sentence here.</span>\n  </p>\n</div>`
                      )
                    }
                    className="aar-button aar-u-w-full" data-size="sm"
                  >
                    💡 Key Takeaway Box
                  </button>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `<div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none"></div>`
                      )
                    }
                    className="aar-button aar-u-w-full" data-size="sm"
                  >
                    ✨ Ambient Glow Blur
                  </button>

                  {uploadedAssets.length > 0 && onInsertImage ? (
                    <div className="aar-u-pt-1 aar-u-border-t aar-u-border-border aar-u-space-y-1">
                      <div className="aar-u-px-2 aar-u-py-0.5 aar-u-text-xs aar-u-font-mono aar-u-uppercase aar-u-text-primary aar-u-font-bold">
                        Uploaded Assets ({uploadedAssets.length}/5)
                      </div>
                      {uploadedAssets.map((asset) => (
                        <button
                          key={asset.id}
                          onClick={() => {
                            onInsertImage(asset.url);
                            setShowSnippets(false);
                          }}
                          className="aar-button aar-u-w-full aar-u-flex aar-u-gap-1.5"
                          title={`Insert ${asset.name}`} data-size="sm"
                        >
                          <img src={asset.url} alt="" className="aar-u-w-3.5 aar-u-h-3.5 aar-u-rounded aar-u-object-cover aar-u-shrink-0 aar-u-border aar-u-border-emerald-500-30" />
                          <span className="aar-u-truncate">Insert: {asset.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : userImage && onInsertImage ? (
                    <button
                      onClick={() => {
                        onInsertImage(userImage);
                        setShowSnippets(false);
                      }}
                      className="aar-button aar-u-w-full" data-size="sm"
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
        <div className="aar-toolbar-group">
          {/* Format HTML button */}
          {codeType === 'html' && (
            <button
              onClick={handleFormat}
              className="aar-button "
              title="Auto-format HTML Indentation" data-size="sm"
            >
              <AlignLeft className="aar-u-w-3.5 aar-u-h-3.5" />
            </button>
          )}

          {/* Word Wrap Toggle */}
          <button
            onClick={() => setWordWrap(!wordWrap)}
            className={`aar-button ${
              wordWrap
                ? 'aar-u-bg-surface-subtle aar-u-text-primary'
                : 'aar-u-bg-surface-subtle aar-u-text-text-muted aar-u-hover-text-text'
            }`}
            title={wordWrap ? 'Word Wrap: ON' : 'Word Wrap: OFF'} data-size="sm"
          >
            <WrapText className="aar-u-w-3.5 aar-u-h-3.5" />
          </button>

          {/* Font Size Adjusters */}
          <div className="aar-button-group" data-size="sm" role="group" aria-label="Editor font size">
            <button
              onClick={() => setFontSize((s) => Math.max(11, s - 1))}
              className="aar-button "
              title="Decrease Font Size" aria-label="Decrease Font Size" data-size="sm"
            >
              <ZoomOut className="aar-u-w-3 aar-u-h-3" />
            </button>
            <span className="aar-button-group-value" aria-label="Editor font size value">{fontSize}px</span>
            <button
              onClick={() => setFontSize((s) => Math.min(20, s + 1))}
              className="aar-button "
              title="Increase Font Size" aria-label="Increase Font Size" data-size="sm"
            >
              <ZoomIn className="aar-u-w-3 aar-u-h-3" />
            </button>
          </div>

          {/* Copy Code */}
          <button
            onClick={handleCopy}
            className="aar-button "
            title="Copy Code to Clipboard" data-size="sm"
          >
            {copied ? <Check className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-success" /> : <Copy className="aar-u-w-3.5 aar-u-h-3.5" />}
          </button>

          {/* Clear Code */}
          <button
            onClick={onClear}
            className="aar-button "
            title="Clear canvas" data-size="sm"
          >
            <Trash2 className="aar-u-w-3.5 aar-u-h-3.5" />
          </button>

          {/* Width Expand / Fullscreen Toggle */}
          {onToggleWide && (
            <button
              onClick={onToggleWide}
              className={`aar-button ${
                isWide
                  ? 'aar-u-border-border aar-u-bg-surface-subtle aar-u-text-primary'
                  : 'aar-u-border-border aar-u-bg-surface-subtle aar-u-text-text-muted aar-u-hover-text-text'
              }`}
              title={isWide ? 'Minimize Editor View' : 'Expand Editor Fullscreen'} data-size="sm"
            >
              {isWide ? <Minimize2 className="aar-u-w-3.5 aar-u-h-3.5" /> : <Maximize2 className="aar-u-w-3.5 aar-u-h-3.5" />}
            </button>
          )}

          {/* Collapse/Hide Panel button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="aar-button aar-u-ml-0.5"
              title="Collapse Editor Panel" data-size="sm"
            >
              <ChevronRight className="aar-u-w-3.5 aar-u-h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* MAIN CODEMIRROR WORKBENCH AREA */}
      <div className="aar-u-flex-1 aar-u-min-h-0 aar-u-relative aar-u-overflow-hidden">
        <CodeMirror
          value={code}
          height="100%"
          theme="none"
          extensions={extensions}
          onChange={(val) => onChange(val)}
          placeholder={
            codeType === 'html'
              ? '<!-- Type or paste HTML + CSS here. Tailwind-compatible utilities are generated at runtime. -->\n<div class="w-full h-full p-8 bg-slate-900 text-white flex flex-col justify-center items-center">\n  <h1 class="text-[64px] font-extrabold text-cyan-400">Design Title</h1>\n  <p class="text-slate-400 mt-2">Adjust content, colors, and layout in real time.</p>\n</div>'
              : '// Canvas 2D Code (canvas, ctx, width, height are available)\nctx.fillStyle = "#090a10";\nctx.fillRect(0, 0, width, height);\n\nctx.fillStyle = "#38bdf8";\nctx.font = "bold 36px Inter, sans-serif";\nctx.fillText("Dynamic Canvas", 60, 100);'
          }
          className="aar-u-h-full aar-u-font-mono aar-u-text-sm aar-u-overflow-auto"
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

      {/* BOTTOM STATUS & LINTING DIAGNOSTICS BAR (Hidden on mobile when expanded) */}
      <div className={`aar-statusbar aar-u-px-4 aar-u-py-1.5 aar-u-bg-surface-subtle aar-u-text-sm aar-u-font-mono aar-u-text-text-muted aar-u-select-none aar-u-shrink-0 ${
        isWide ? 'aar-u-hidden aar-u-lg-flex' : 'aar-u-flex'
      }`}>
        <div className="aar-toolbar-group">
          {/* Real-time Lint Diagnostic Status */}
          {diagnosticsCount === 0 ? (
            <span className="aar-u-flex aar-u-items-center aar-u-gap-1.5 aar-u-text-success aar-u-font-semibold">
              <CheckCircle2 className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-success" />
              <span>Syntax Valid</span>
            </span>
          ) : (
            <span className="aar-u-flex aar-u-items-center aar-u-gap-1.5 aar-u-text-danger aar-u-font-semibold aar-u-animate-pulse">
              <AlertCircle className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-danger" />
              <span>{diagnosticsCount} Syntax {diagnosticsCount === 1 ? 'Issue' : 'Issues'}</span>
            </span>
          )}

          <span className="aar-u-text-text-muted">|</span>
          <span>{lineCount} lines</span>
          <span>{code.length} chars</span>
        </div>

        <div className="aar-toolbar-group aar-u-text-text-muted">
          <span>Tab: 2sp</span>
          <span>UTF-8</span>
          <span className="aar-u-text-primary aar-u-font-semibold">{codeType.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
