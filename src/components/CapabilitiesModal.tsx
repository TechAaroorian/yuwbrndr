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
    <div className="fixed inset-0 z-[80] bg-black/60 p-4 flex items-center justify-center" onMouseDown={onClose}>
      <section className="w-full max-w-3xl max-h-[86vh] overflow-auto rounded-2xl border border-white/10 bg-studio-900 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <header className="sticky top-0 flex items-start justify-between gap-4 border-b border-white/10 bg-studio-900 px-6 py-5">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-slate-100"><Code2 className="w-5 h-5 text-indigo-400" /> Design capabilities</div>
            <p className="mt-1 text-sm text-slate-400">What the editor can render safely and reliably today.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Close"><X className="w-5 h-5" /></button>
        </header>
        <div className="p-6 space-y-3">
          {capabilities.map(([name, status, description]) => (
            <div key={name} className="grid gap-3 rounded-xl border border-white/10 bg-studio-850 p-4 sm:grid-cols-[1fr_auto]">
              <div><div className="font-semibold text-slate-100">{name}</div><div className="mt-1 text-sm leading-relaxed text-slate-400">{description}</div></div>
              <div className="flex items-center gap-1.5 self-start rounded-full border border-white/10 px-2.5 py-1 text-xs font-semibold text-slate-300"><Check className="w-3.5 h-3.5 text-emerald-400" />{status}</div>
            </div>
          ))}
          <div className="flex gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-sm text-indigo-100">
            <ShieldCheck className="w-5 h-5 shrink-0 text-indigo-300" />
            <p>HTML scripts are disabled. Canvas JavaScript runs in a sandbox without access to the application origin. External libraries will only be added through a future reviewed allowlist.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
