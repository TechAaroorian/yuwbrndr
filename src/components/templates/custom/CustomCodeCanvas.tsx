import React, { useEffect, useId, useMemo, useState } from 'react';
import { Code2, Sparkles } from 'lucide-react';
import { ColorTheme } from '../../../types/studio';
import { generateRuntimeUtilityCss } from '../../../utils/runtimeStyles';

interface Props {
  codeType: 'html' | 'canvas';
  code: string;
  theme: ColorTheme;
  width: number;
  height: number;
  userImage?: string | null;
  useAsBackground?: boolean;
  onPasteSample?: (type: 'html' | 'canvas') => void;
  onTriggerUpload?: () => void;
  onOpenAiPrompt?: () => void;
}

const escapeScriptValue = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

export const CustomCodeCanvas: React.FC<Props> = ({
  codeType,
  code,
  theme,
  width,
  height,
  userImage,
  useAsBackground = false,
  onPasteSample,
  onTriggerUpload,
  onOpenAiPrompt,
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
    const background = useAsBackground && userImage
      ? `background-color:${theme.background};background-image:url(${JSON.stringify(userImage)});background-size:cover;background-position:center;`
      : `background:${theme.background};`;

    const base = `html,body{width:100%;height:100%;margin:0;overflow:hidden}*{box-sizing:border-box}body{${background}}`;

    if (codeType === 'html') {
      return `<!doctype html><html><head><meta charset="utf-8"><style>${base}\n${runtimeCss}</style></head><body>${code}</body></html>`;
    }

    const safeCode = escapeScriptValue(code);
    return `<!doctype html><html><head><meta charset="utf-8"><style>${base}canvas{display:block;width:100%;height:100%}</style></head><body><canvas id="canvas" width="${width}" height="${height}"></canvas><script>
      const frameId=${escapeScriptValue(frameId)};
      const canvas=document.getElementById('canvas');
      const ctx=canvas.getContext('2d');
      const width=${width}; const height=${height};
      const send=(type,payload={})=>parent.postMessage({source:'yuwbrndr-preview',frameId,type,...payload},'*');
      try { const run=new Function('canvas','ctx','width','height',${safeCode}); run(canvas,ctx,width,height); send('render-ready'); }
      catch(error){ send('render-error',{message:error instanceof Error?error.message:String(error)}); }
      addEventListener('message',(event)=>{ if(event.data?.type==='yuwbrndr-export'&&event.data?.frameId===frameId){
        try { const scale=Math.max(1,Number(event.data.scale)||1); const output=document.createElement('canvas'); output.width=width*scale; output.height=height*scale; const outputCtx=output.getContext('2d'); outputCtx.drawImage(canvas,0,0,output.width,output.height); send('export-result',{requestId:event.data.requestId,dataUrl:output.toDataURL('image/png')}); }
        catch(error){ send('export-error',{requestId:event.data.requestId,message:String(error)}); }
      }});
    </script></body></html>`;
  }, [code, codeType, frameId, height, runtimeCss, theme.background, useAsBackground, userImage, width]);

  if (isEmpty) {
    return (
      <div className="design-canvas w-full h-full flex flex-col items-center justify-center p-12 text-center" style={{ background: theme.background }}>
        <div className="w-14 h-14 rounded-xl border flex items-center justify-center mb-4" style={{ background: `${theme.primary}20`, borderColor: `${theme.primary}50`, color: theme.accent }}>
          <Code2 className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Start your design</h3>
        <p className="text-sm text-slate-400 mb-6 max-w-md">Choose a template, write HTML and CSS, or use the advanced Canvas JavaScript mode.</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {onOpenAiPrompt && (
            <button
              onClick={onOpenAiPrompt}
              className="px-4 py-2 rounded-lg border border-cyan-500/40 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Generate with AI
            </button>
          )}
          {onPasteSample && <button onClick={() => onPasteSample('html')} className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-slate-200 text-sm font-semibold flex items-center gap-2 hover:bg-white/10 transition-colors"><Sparkles className="w-4 h-4" />Load sample</button>}
          {onTriggerUpload && <button onClick={onTriggerUpload} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors">Upload image</button>}
        </div>
      </div>
    );
  }

  return (
    <div className="design-canvas w-full h-full relative overflow-hidden" style={{ background: theme.background }}>
      <iframe
        title="Sandboxed design preview"
        data-yuwbrndr-preview={codeType}
        data-frame-id={frameId}
        sandbox={codeType === 'html' ? 'allow-same-origin' : 'allow-scripts'}
        srcDoc={srcDoc}
        className="w-full h-full border-0 bg-transparent"
      />
      {renderError && (
        <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-rose-950/95 border border-rose-500/50 text-rose-200 text-xs font-mono">
          <strong>Execution error:</strong> {renderError}
        </div>
      )}
    </div>
  );
};
