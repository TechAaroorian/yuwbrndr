import React from 'react';
import { ExternalLink, Heart, ShieldCheck, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="aar-u-fixed aar-u-inset-0 aar-u-z--90 aar-u-flex aar-u-items-center aar-u-justify-center aar-u-bg-black-60 aar-u-p-3 aar-u-sm-p-4" onMouseDown={onClose}>
      <section className="aar-u-w-full aar-u-max-w-2xl aar-u-max-h--90vh aar-u-flex aar-u-flex-col aar-u-overflow-hidden aar-u-rounded aar-u-border aar-u-border-border aar-u-bg-surface " onMouseDown={(event) => event.stopPropagation()}>
        <header className="aar-u-flex aar-u-items-start aar-u-justify-between aar-u-gap-4 aar-u-border-b aar-u-border-border aar-u-px-4 aar-u-sm-px-6 aar-u-py-4 aar-u-sm-py-5 aar-u-shrink-0">
          <div className="aar-u-flex aar-u-items-center aar-u-gap-3">
            <img src="./yuwbrndr-logo.svg" alt="" className="aar-u-h-10 aar-u-w-10 aar-u-sm-h-11 aar-u-sm-w-11 aar-u-shrink-0" />
            <div>
              <h2 className="aar-u-text-lg aar-u-sm-text-xl aar-u-font-bold aar-u-text-text">About Yuwbrndr</h2>
              <p className="aar-u-mt-0.5 aar-u-sm-mt-1 aar-u-text-xs aar-u-sm-text-sm aar-u-text-text-muted">A browser-based studio for creating social graphics from code.</p>
            </div>
          </div>
          <button onClick={onClose} className="aar-button " aria-label="Close About dialog" data-size="sm">
            <X className="aar-u-h-5 aar-u-w-5" />
          </button>
        </header>

        <div className="aar-u-space-y-4 aar-u-sm-space-y-5 aar-u-p-4 aar-u-sm-p-6 aar-u-overflow-y-auto">
          <p className="aar-u-text-sm aar-u-leading-7 aar-u-text-text">
            Yuwbrndr lets anyone create and export graphics without an account, watermark, or usage limit. Designs and uploaded files are processed 100% locally in your browser. We use lightweight, cookie-free GoatCounter strictly for anonymous visit counts—your code, designs, and content are never tracked or uploaded.
          </p>

          <div className="aar-u-rounded aar-u-border aar-u-border-amber-300 aar-u-bg-amber-50 aar-u-p-4 aar-u-dark-border-amber-500-20 aar-u-dark-bg-amber-500-10">
            <div className="aar-u-flex aar-u-items-center aar-u-gap-2 aar-u-font-semibold aar-u-text-amber-800 aar-u-dark-text-amber-200">
              <ShieldCheck className="aar-u-h-5 aar-u-w-5" /> Your content, your responsibility
            </div>
            <p className="aar-u-mt-2 aar-u-text-sm aar-u-leading-6 aar-u-text-text">
              You are responsible for the code, text, images, fonts, trademarks, personal data, and other assets you use or publish. Make sure you have the necessary rights and permissions, and review generated output for accuracy and suitability before sharing it.
            </p>
          </div>

          <div className="aar-u-grid aar-u-gap-3 aar-u-sm-grid-cols-2">
            <div className="aar-u-rounded aar-u-border aar-u-border-border aar-u-bg-background aar-u-p-4">
              <div className="aar-u-font-semibold aar-u-text-text">Use trusted code</div>
              <p className="aar-u-mt-1 aar-u-text-sm aar-u-leading-6 aar-u-text-text-muted">Canvas JavaScript runs in an isolated preview, but you should still only use code you understand and trust.</p>
            </div>
            <div className="aar-u-rounded aar-u-border aar-u-border-border aar-u-bg-background aar-u-p-4">
              <div className="aar-u-font-semibold aar-u-text-text">Check platform rules</div>
              <p className="aar-u-mt-1 aar-u-text-sm aar-u-leading-6 aar-u-text-text-muted">You are responsible for following the policies of LinkedIn, Threads, Instagram, and any other publishing platform.</p>
            </div>
          </div>

          <footer className="aar-u-flex aar-u-flex-col aar-u-gap-3 aar-u-border-t aar-u-border-border aar-u-pt-5 aar-u-sm-flex-row aar-u-sm-items-center aar-u-sm-justify-between">
            <span className="aar-u-flex aar-u-items-center aar-u-gap-2 aar-u-text-sm aar-u-text-text-muted"><Heart className="aar-u-h-4 aar-u-w-4 aar-u-text-danger" /> Built by Janarthanan Soundararajan</span>
            <a href="https://github.com/TechAaroorian/yuwbrndr" target="_blank" rel="noreferrer" className="aar-u-inline-flex aar-u-items-center aar-u-gap-1.5 aar-u-text-sm aar-u-font-semibold aar-u-text-primary aar-u-hover-text-primary">
              View project on GitHub <ExternalLink className="aar-u-h-4 aar-u-w-4" />
            </a>
          </footer>
        </div>
      </section>
    </div>
  );
};
