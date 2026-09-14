import React, { useState } from 'react';
import { Copy, Check, X, Code2, Download } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customCode: string;
  customCodeType: 'html' | 'canvas';
}

export const CodeInspector: React.FC<Props> = ({
  isOpen,
  onClose,
  customCode,
  customCodeType,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(customCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = customCodeType === 'html' ? 'html' : 'js';
    const blob = new Blob([customCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `yuwbrndr-export.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#090b17] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Inspect Pure Code</h2>
              <p className="text-[11px] text-slate-400 font-mono">
                {customCodeType === 'html' ? 'HTML / Tailwind CSS Markup' : 'Canvas 2D / WebGL JavaScript'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-slate-200 font-medium flex items-center gap-1.5 transition-all"
              title="Download source code"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Download .{customCodeType === 'html' ? 'html' : 'js'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-200 bg-[#05070f] leading-relaxed select-text whitespace-pre-wrap">
          {customCode ? customCode : '<!-- Empty canvas. No code entered yet. -->'}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#080914] flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Lines: {customCode ? customCode.split('\n').length : 0}</span>
          <span>Characters: {customCode.length}</span>
        </div>
      </div>
    </div>
  );
};
