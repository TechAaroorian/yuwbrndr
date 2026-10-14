import React from 'react';
import { Check, Code2, ShieldCheck, X } from 'lucide-react';

interface Props { isOpen: boolean; onClose: () => void; }

const capabilities = [
  ['HTML and inline CSS', 'Supported', 'Rendered inside an isolated preview document.'],
  ['Tailwind-compatible utilities', 'Supported', 'Generated at runtime by UnoCSS Wind4, including arbitrary values.'],
  ['Canvas 2D JavaScript', 'Advanced', 'Runs in an origin-isolated sandbox with canvas, ctx, width, and height bindings.'],
  ['Uploaded images', 'Supported', 'Kept in browser memory; files are not uploaded to a server.'],
  ['Curated web fonts', 'Supported', 'The font catalog provides tested snippets and fallbacks.'],
  ['Three.js and Lucide React APIs', 'App only', 'Used internally; not exposed as globals in user code yet.'],
  ['External scripts and arbitrary CDNs', 'Not supported', 'Blocked until an allowlisted dependency loader is designed.'],
  ['React components', 'Not supported', 'The editor accepts HTML/CSS or Canvas JavaScript, not JSX.'],
];

export const CapabilitiesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="aar-u-fixed aar-u-inset-0 aar-u-z--80 aar-u-bg-black-60 aar-u-p-4 aar-u-flex aar-u-items-center aar-u-justify-center" onMouseDown={onClose}>
      <section className="aar-u-w-full aar-u-max-w-3xl aar-u-max-h--86vh aar-u-overflow-auto aar-u-rounded aar-u-border aar-u-border-border aar-u-bg-surface " onMouseDown={(event) => event.stopPropagation()}>
        <header className="aar-u-sticky aar-u-top-0 aar-u-flex aar-u-items-start aar-u-justify-between aar-u-gap-4 aar-u-border-b aar-u-border-border aar-u-bg-surface aar-u-px-6 aar-u-py-5">
          <div>
            <div className="aar-u-flex aar-u-items-center aar-u-gap-2 aar-u-text-lg aar-u-font-bold aar-u-text-text"><Code2 className="aar-u-w-5 aar-u-h-5 aar-u-text-primary" /> Design capabilities</div>
            <p className="aar-u-mt-1 aar-u-text-sm aar-u-text-text-muted">What the editor can render safely and reliably today.</p>
          </div>
          <button onClick={onClose} className="aar-button " aria-label="Close" data-size="sm"><X className="aar-u-w-5 aar-u-h-5" /></button>
        </header>
        <div className="aar-u-p-6 aar-u-space-y-3">
          {capabilities.map(([name, status, description]) => (
            <div key={name} className="aar-u-grid aar-u-gap-3 aar-u-rounded aar-u-border aar-u-border-border aar-u-bg-background aar-u-p-4 aar-u-sm-grid-cols--1fr-auto">
              <div><div className="aar-u-font-semibold aar-u-text-text">{name}</div><div className="aar-u-mt-1 aar-u-text-sm aar-u-leading-relaxed aar-u-text-text-muted">{description}</div></div>
              <div className="aar-u-flex aar-u-items-center aar-u-gap-1.5 aar-u-self-start aar-u-rounded-full aar-u-border aar-u-border-border aar-u-px-2.5 aar-u-py-1 aar-u-text-xs aar-u-font-semibold aar-u-text-text"><Check className="aar-u-w-3.5 aar-u-h-3.5 aar-u-text-success" />{status}</div>
            </div>
          ))}
          <div className="aar-u-flex aar-u-gap-3 aar-u-rounded aar-u-border aar-u-border-indigo-500-20 aar-u-bg-indigo-500-10 aar-u-p-4 aar-u-text-sm aar-u-text-indigo-100">
            <ShieldCheck className="aar-u-w-5 aar-u-h-5 aar-u-shrink-0 aar-u-text-primary" />
            <p>HTML scripts are disabled. Canvas JavaScript runs in a sandbox without access to the application origin. External libraries will only be added through a future reviewed allowlist.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
