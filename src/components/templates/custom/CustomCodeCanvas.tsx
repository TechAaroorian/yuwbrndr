import React, { useEffect, useId, useMemo, useState } from 'react';
import { Code2, Sparkles, Upload, Copy } from 'lucide-react';
import roughScript from 'roughjs/bundled/rough.js?raw';
import { ColorTheme } from '../../../types/studio';
import { generateRuntimeUtilityCss } from '../../../utils/runtimeStyles';

interface Props {
  codeType: 'html' | 'canvas';
  code: string;
  theme: ColorTheme;
  width: number;
  height: number;
  fontScale?: number;
  userImage?: string | null;
  useAsBackground?: boolean;
  onPasteSample?: (type: 'html' | 'canvas') => void;
  onTriggerUpload?: () => void;
  onOpenAiPrompt?: () => void;
  onCopyPreviousSlide?: () => void;
}

const escapeScriptValue = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

export const CustomCodeCanvas: React.FC<Props> = ({
  codeType,
  code,
  theme,
  width,
  height,
  fontScale = 1.0,
  userImage,
  useAsBackground = false,
  onPasteSample,
  onTriggerUpload,
  onOpenAiPrompt,
  onCopyPreviousSlide,
}) => {
  const reactId = useId();
  const frameId = useMemo(() => `preview-${reactId.replace(/:/g, '')}`, [reactId]);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [runtimeCss, setRuntimeCss] = useState('');
  const isEmpty = !code.trim();

  useEffect(() => {
    const receivePreviewMessage = (event: MessageEvent) => {
      if (event.data?.source !== 'yuwbrndr-preview' || event.data?.frameId !== frameId) return;
      if (event.data.type === 'render-error') setRenderError(event.data.message);
      if (event.data.type === 'render-ready') setRenderError(null);
    };
    window.addEventListener('message', receivePreviewMessage);
    return () => window.removeEventListener('message', receivePreviewMessage);
  }, [frameId]);

  useEffect(() => {
    let active = true;
    if (codeType !== 'html') {
      return () => { active = false; };
    }
    generateRuntimeUtilityCss(code)
      .then((css) => { if (active) setRuntimeCss(css); })
      .catch((error) => { if (active) setRenderError(`Utility CSS: ${String(error)}`); });
    return () => { active = false; };
  }, [code, codeType]);

  const srcDoc = useMemo(() => {
    const safeUserImage = userImage ? userImage.replace(/['"\\]/g, '') : '';
    const background = useAsBackground && safeUserImage
      ? `background-color:${theme.background};background-image:url('${safeUserImage}');background-size:cover;background-position:center;background-repeat:no-repeat;`
      : `background:${theme.background};`;

    const fontLinks = `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Caveat:wght@400..700&family=Cinzel:wght@600;700;800;900&family=Comic+Neue:ital,wght@0,400;0,700;1,400;1,700&family=Fira+Code:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&family=Patrick+Hand&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Press+Start+2P&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
    `;

    const fontStyles = `
      .font-comic, [class*="font-comic"] { font-family: 'Comic Neue', cursive, sans-serif !important; }
      .font-caveat, [class*="font-caveat"] { font-family: 'Caveat', cursive, sans-serif !important; }
      .font-hand, [class*="font-hand"] { font-family: 'Patrick Hand', cursive, sans-serif !important; }
      .font-arcade, [class*="font-arcade"] { font-family: 'Press Start 2P', monospace !important; }
      .font-bebas, [class*="font-bebas"] { font-family: 'Bebas Neue', Impact, sans-serif !important; }
      .font-inter, [class*="font-inter"] { font-family: 'Inter', system-ui, sans-serif !important; }
      .font-mono, [class*="font-mono"] { font-family: 'JetBrains Mono', monospace !important; }
      .font-fira, [class*="font-fira"] { font-family: 'Fira Code', monospace !important; }
    `;

    const baseFontSize = Math.round(16 * (fontScale || 1.0) * 100) / 100;
    const base = `html{font-size:${baseFontSize}px;--font-scale:${fontScale || 1.0}}html,body{width:100%;height:100%;margin:0;overflow:hidden}*{box-sizing:border-box}body{${background}color:${theme.text};}`;

    const isDark = theme.id !== 'minimalist';
    const htmlThemeAttrs = `class="${isDark ? 'dark' : ''}" data-theme="${isDark ? 'dark' : 'light'}"`;

    const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: blob: https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com data:; img-src * data: blob:; media-src * data: blob:; script-src 'unsafe-inline' 'unsafe-eval' blob: data:; connect-src 'none'; worker-src 'none'; child-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; manifest-src 'none';">`;

    const securityPreamble = `
      const frameId = ${escapeScriptValue(frameId)};
      const host = window.parent;
      const targetOrigin = window.location.origin;
      const send = (type, payload = {}) => {
        try { host.postMessage({ source: 'yuwbrndr-preview', frameId, type, ...(payload || {}) }, targetOrigin || '*'); } catch (_) {}
      };
      (function() {
        const neutralize = (target, prop, getter) => {
          let curr = target;
          while (curr && curr !== Object.prototype) {
            try {
              Object.defineProperty(curr, prop, {
                get: getter,
                set: () => {},
                configurable: false,
                enumerable: false
              });
            } catch (_) {}
            try { curr = Object.getPrototypeOf(curr); } catch (_) { break; }
          }
        };

        // Host window traversal & isolation
        neutralize(window, 'parent', () => null);
        neutralize(window, 'top', () => null);
        neutralize(window, 'frameElement', () => null);
        neutralize(window, 'opener', () => null);

        // Storage & cookie isolation
        neutralize(window, 'localStorage', () => null);
        neutralize(window, 'sessionStorage', () => null);
        neutralize(window, 'indexedDB', () => null);
        neutralize(window, 'caches', () => null);
        neutralize(document, 'cookie', () => '');
        neutralize(document, 'domain', () => '');

        // Communication & Worker channels
        neutralize(window, 'BroadcastChannel', () => function() { throw new Error('BroadcastChannel is disabled in preview.'); });
        neutralize(window, 'SharedWorker', () => function() { throw new Error('SharedWorker is disabled in preview.'); });
        neutralize(window, 'Worker', () => function() { throw new Error('Worker is disabled in preview.'); });

        // Network exfiltration APIs (defense-in-depth along with CSP connect-src 'none')
        neutralize(window, 'fetch', () => () => Promise.reject(new Error('Network access is disabled in preview.')));
        neutralize(window, 'XMLHttpRequest', () => function() { throw new Error('Network access is disabled in preview.'); });
        neutralize(window, 'WebSocket', () => function() { throw new Error('WebSocket is disabled in preview.'); });
        neutralize(window, 'EventSource', () => function() { throw new Error('EventSource is disabled in preview.'); });
        neutralize(window, 'RTCPeerConnection', () => function() { throw new Error('WebRTC is disabled in preview.'); });
        neutralize(window, 'webkitRTCPeerConnection', () => function() { throw new Error('WebRTC is disabled in preview.'); });

        // Navigation & popups
        neutralize(window, 'open', () => () => null);

        // Navigator permissions & telemetry
        if (typeof navigator !== 'undefined') {
          try {
            Object.defineProperty(navigator, 'serviceWorker', { get: () => null, configurable: false });
            Object.defineProperty(navigator, 'sendBeacon', { value: () => false, configurable: false, writable: false });
          } catch (_) {}
        }
      })();
    `;

    if (codeType === 'html') {
      return `<!doctype html><html ${htmlThemeAttrs}><head><meta charset="utf-8">${csp}<script>${securityPreamble}</script>${fontLinks}<style>${base}\n${fontStyles}\n${runtimeCss}</style><script>${roughScript}</script><script>
        window.addEventListener('error',(event)=>{ send('render-error',{message:event.message||String(event.error)}); });
        function initRoughDeclarative(){
          if(!window.rough) return;
          document.querySelectorAll('svg[data-rough-rect]').forEach(svg => {
            try {
              if (svg.dataset.roughInitialized) return;
              svg.dataset.roughInitialized = 'true';
              const rc = window.rough.svg(svg);
              const w = svg.clientWidth || svg.parentElement?.clientWidth || 300;
              const h = svg.clientHeight || svg.parentElement?.clientHeight || 150;
              if (!svg.getAttribute('viewBox')) svg.setAttribute('viewBox', \`0 0 \${w} \${h}\`);
              const raw = svg.getAttribute('data-rough-rect') || '';
              const options = {};
              raw.split(';').forEach(part => {
                const [k, v] = part.split(':').map(s => s.trim());
                if (!k || !v) return;
                if (v === 'true') options[k] = true;
                else if (v === 'false') options[k] = false;
                else if (!isNaN(Number(v))) options[k] = Number(v);
                else options[k] = v;
              });
              const node = rc.rectangle(2, 2, Math.max(1, w - 4), Math.max(1, h - 4), options);
              svg.appendChild(node);
            } catch(e) { console.warn(e); }
          });
        }
        document.addEventListener('DOMContentLoaded', () => { initRoughDeclarative(); send('render-ready'); });
        setTimeout(() => { initRoughDeclarative(); send('render-ready'); }, 50);
      </script></head><body style="${background}color:${theme.text};">${code}</body></html>`;
    }

    const safeCode = escapeScriptValue(code);
    return `<!doctype html><html ${htmlThemeAttrs}><head><meta charset="utf-8">${csp}<script>${securityPreamble}</script>${fontLinks}<style>${base}${fontStyles}canvas{display:block;width:100%;height:100%}</style><script>${roughScript}</script></head><body><canvas id="canvas" width="${width}" height="${height}"></canvas><script>
      const canvas=document.getElementById('canvas');
      const ctx=canvas.getContext('2d');
      const width=${width}; const height=${height};
      try { const run=new Function('canvas','ctx','width','height','rough',${safeCode}); run(canvas,ctx,width,height,window.rough); send('render-ready'); }
      catch(error){ send('render-error',{message:error instanceof Error?error.message:String(error)}); }
      addEventListener('message',(event)=>{ if(event.data?.type==='yuwbrndr-export'&&event.data?.frameId===frameId){
        try {
          const scale=Math.max(1,Number(event.data.scale)||1);
          const output=document.createElement('canvas');
          output.width=width*scale;
          output.height=height*scale;
          const outputCtx=output.getContext('2d');
          const finish=()=>{
            outputCtx.drawImage(canvas,0,0,output.width,output.height);
            send('export-result',{requestId:event.data.requestId,dataUrl:output.toDataURL('image/png')});
          };
          if(${escapeScriptValue(useAsBackground && !!userImage)}){
            const bgImg=new Image();
            bgImg.onload=()=>{
              try{ outputCtx.drawImage(bgImg,0,0,output.width,output.height); }catch(e){}
              finish();
            };
            bgImg.onerror=()=>{
              outputCtx.fillStyle=${escapeScriptValue(theme.background)};
              outputCtx.fillRect(0,0,output.width,output.height);
              finish();
            };
            bgImg.src=${escapeScriptValue(userImage || '')};
          } else {
            outputCtx.fillStyle=${escapeScriptValue(theme.background)};
            outputCtx.fillRect(0,0,output.width,output.height);
            finish();
          }
        }
        catch(error){ send('export-error',{requestId:event.data.requestId,message:String(error)}); }
      }});
    </script></body></html>`;
  }, [code, codeType, fontScale, frameId, height, runtimeCss, theme.background, theme.id, theme.text, useAsBackground, userImage, width]);

  if (isEmpty) {
    return (
      <div
        className="aar-u-w-full aar-u-h-full aar-u-flex aar-u-items-center aar-u-justify-center aar-u-p-8 aar-u-select-none"
        style={{
          backgroundColor: theme.background,
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <div
          className="aar-canvas-empty"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '0.75rem',
            maxWidth: '32rem',
            margin: '0 auto',
          }}
        >
          <div
            className="aar-canvas-empty-icon"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '3rem',
              height: '3rem',
              borderRadius: '0.75rem',
              background: `color-mix(in srgb, ${theme.primary} 15%, transparent)`,
              color: theme.accent,
            }}
          >
            <Code2 size={24} />
          </div>
          <div
            className="aar-canvas-empty-text"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <h3
              className="aar-u-text-xl aar-u-font-bold"
              style={{ margin: 0, lineHeight: 1.25, color: theme.text }}
            >
              Start your design
            </h3>
            <p
              className="aar-u-text-sm"
              style={{ margin: 0, lineHeight: 1.45, maxWidth: '28rem', color: theme.muted }}
            >
              Choose a template, write HTML and CSS, or use the advanced Canvas JavaScript mode.
            </p>
          </div>
          <div
            className="aar-canvas-empty-actions"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.25rem',
            }}
          >
            {onCopyPreviousSlide && (
              <button
                onClick={onCopyPreviousSlide}
                className="aar-button"
                data-variant="primary"
                data-size="sm"
              >
                <Copy size={14} />
                <span>Copy current slide</span>
              </button>
            )}
            {onOpenAiPrompt && (
              <button
                onClick={onOpenAiPrompt}
                className="aar-button"
                data-variant="ai"
                data-size="sm"
              >
                <Sparkles size={14} />
                <span>Generate with AI</span>
              </button>
            )}
            {onPasteSample && (
              <button
                onClick={() => onPasteSample('html')}
                className="aar-button"
                data-size="sm"
              >
                <Code2 size={14} />
                <span>Load sample</span>
              </button>
            )}
            {onTriggerUpload && (
              <button
                onClick={onTriggerUpload}
                className="aar-button"
                data-variant="quiet"
                data-size="sm"
              >
                <Upload size={14} />
                <span>Upload image</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="aar-canvas-artboard aar-u-relative aar-u-overflow-hidden aar-u-w-full aar-u-h-full" 
      style={{ 
        width: `${width}px`,
        height: `${height}px`,
        maxWidth: `${width}px`,
        maxHeight: `${height}px`,
        backgroundColor: theme.background,
        backgroundImage: useAsBackground && userImage ? `url("${userImage}")` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <iframe
        title="Sandboxed design preview"
        data-yuwbrndr-preview={codeType}
        data-frame-id={frameId}
        sandbox="allow-scripts allow-same-origin"
        srcDoc={srcDoc}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
          background: 'transparent',
        }}
      />
      {renderError && (
        <div className="aar-banner aar-u-absolute aar-u-bottom-4 aar-u-left-4 aar-u-right-4 aar-u-font-mono aar-u-text-xs" data-tone="danger">
          <strong>Execution error:</strong> {renderError}
        </div>
      )}
    </div>
  );
};
