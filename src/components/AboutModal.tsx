import React from 'react';
import { ExternalLink, Heart, ShieldCheck, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4" onMouseDown={onClose}>
      <section className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-studio-900 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <header className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <img src="./yuwbrndr-logo.svg" alt="" className="h-11 w-11" />
            <div>
              <h2 className="text-xl font-bold text-slate-100">About Yuwbrndr</h2>
              <p className="mt-1 text-sm text-slate-400">A browser-based studio for creating social graphics from code.</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Close About dialog">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-5 p-6">
          <p className="text-sm leading-7 text-slate-300">
            Yuwbrndr lets anyone create and export graphics without an account, watermark, or usage limit. Designs and uploaded files are processed locally in the browser and are not intentionally sent to a Yuwbrndr server.
          </p>

          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
            <div className="flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-200">
              <ShieldCheck className="h-5 w-5" /> Your content, your responsibility
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              You are responsible for the code, text, images, fonts, trademarks, personal data, and other assets you use or publish. Make sure you have the necessary rights and permissions, and review generated output for accuracy and suitability before sharing it.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-studio-850 p-4">
              <div className="font-semibold text-slate-100">Use trusted code</div>
              <p className="mt-1 text-sm leading-6 text-slate-400">Canvas JavaScript runs in an isolated preview, but you should still only use code you understand and trust.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-studio-850 p-4">
              <div className="font-semibold text-slate-100">Check platform rules</div>
              <p className="mt-1 text-sm leading-6 text-slate-400">You are responsible for following the policies of LinkedIn, Threads, Instagram, and any other publishing platform.</p>
            </div>
          </div>

          <footer className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2 text-sm text-slate-400"><Heart className="h-4 w-4 text-rose-400" /> Built by Janarthanan Soundararajan</span>
            <a href="https://github.com/TechAaroorian/yuwbrndr" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-300 hover:text-indigo-200">
              View project on GitHub <ExternalLink className="h-4 w-4" />
            </a>
          </footer>
        </div>
      </section>
    </div>
  );
};
