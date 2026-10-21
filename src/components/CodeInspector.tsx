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
    <div className="aar-u-fixed aar-u-inset-0 aar-u-z-50 aar-u-bg-black-80  aar-u-flex aar-u-items-center aar-u-justify-center aar-u-p-4 aar-u-select-none aar-u-animate-in aar-u-fade-in aar-u-duration-200">
      <div className="aar-u-w-full aar-u-max-w-3xl aar-u-bg--090b17 aar-u-border aar-u-border-border aar-u-rounded aar-u-overflow-hidden  aar-u-flex aar-u-flex-col aar-u-max-h--85vh">
        {/* Header */}
        <div className="aar-u-px-6 aar-u-py-4 aar-u-border-b aar-u-border-border aar-u-flex aar-u-items-center aar-u-justify-between">
          <div className="aar-u-flex aar-u-items-center aar-u-gap-2.5">
            <Code2 className="aar-u-w-5 aar-u-h-5 aar-u-text-primary" />
            <div>
              <h2 className="aar-u-text-base aar-u-font-bold aar-u-text-text aar-u-tracking-tight">Inspect Pure Code</h2>
              <p className="aar-u-text-sm aar-u-text-text-muted aar-u-font-mono">
                {customCodeType === 'html' ? 'HTML + CSS Markup' : 'Canvas 2D JavaScript'}
              </p>
            </div>
          </div>

          <div className="aar-u-flex aar-u-items-center aar-u-gap-2">
            <button
              onClick={handleDownload}
              className="aar-button aar-u-flex aar-u-gap-1.5"
              title="Download source code" data-size="sm"
            >
              <Download className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-primary" />
              <span>Download .{customCodeType === 'html' ? 'html' : 'js'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="aar-button aar-u-flex aar-u-gap-1.5" data-variant="primary" data-size="sm"
            >
              {copied ? <Check className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-emerald-400" /> : <Copy className="aar-u-w-3.5 aar-u-h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={onClose}
              className="aar-button aar-u-ml-1" data-size="sm"
            >
              <X className="aar-u-w-4 aar-u-h-4" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="aar-u-p-6 aar-u-overflow-y-auto aar-u-flex-1 aar-u-font-mono aar-u-text-xs aar-u-text-text aar-u-bg--05070f aar-u-leading-relaxed aar-u-select-text aar-u-whitespace-pre-wrap">
          {customCode ? customCode : '<!-- Empty canvas. No code entered yet. -->'}
        </div>

        {/* Footer */}
        <div className="aar-u-px-6 aar-u-py-3 aar-u-border-t aar-u-border-border aar-u-bg--080914 aar-u-flex aar-u-items-center aar-u-justify-between aar-u-text-sm aar-u-font-mono aar-u-text-text-muted">
          <span>Lines: {customCode ? customCode.split('\n').length : 0}</span>
          <span>Characters: {customCode.length}</span>
        </div>
      </div>
    </div>
  );
};
