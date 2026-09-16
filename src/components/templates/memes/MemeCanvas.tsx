import React from 'react';
import { MemeData, ColorTheme } from '../../../types/studio';
import { Heart, Repeat2, MessageCircle, Share, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  data: MemeData;
  theme: ColorTheme;
}

export const MemeCanvas: React.FC<Props> = ({ data, theme }) => {
  return (
    <div 
      className="w-full h-full relative overflow-hidden flex flex-col justify-center items-center p-8 md:p-12 select-none"
      style={{ backgroundColor: theme.background }}
    >
      {/* Background ambient lighting */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none opacity-20"
        style={{ backgroundColor: theme.primary }}
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* 1. Terminal / Code Window Meme */}
      {data.template === 'dev-terminal' && (
        <div 
          className="relative z-10 w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden font-mono"
          style={{ backgroundColor: '#090a0f', borderColor: 'rgba(255, 255, 255, 0.12)' }}
        >
          {/* macOS Titlebar */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Terminal className="w-3.5 h-3.5" />
              <span>bash - production-server - 80x24</span>
            </div>
            <div className="w-12" />
          </div>

          {/* Terminal Body */}
          <div className="p-6 md:p-8 space-y-4 text-sm md:text-base">
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold select-none">root@prod:~$</span>
              <span className="text-slate-100 font-semibold">{data.terminalCommand}</span>
            </div>

            <div className="pl-4 border-l-2 border-rose-500/50 space-y-1.5 py-1">
              {data.terminalOutput.map((line, i) => (
                <div 
                  key={i} 
                  className={i === data.terminalOutput.length - 1 ? "text-amber-300 font-bold" : "text-rose-400"}
                >
                  {line}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
              <span>Status: 137 (Fatal Error)</span>
              <span className="text-indigo-400 font-medium">#DevLife #Yuwbrndr</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Twitter / X Social Card Meme */}
      {data.template === 'tweet-card' && (
        <div 
          className="relative z-10 w-full max-w-xl p-6 md:p-8 rounded-3xl border shadow-2xl backdrop-blur-xl"
          style={{ 
            backgroundColor: 'rgba(15, 18, 28, 0.85)', 
            borderColor: 'rgba(255, 255, 255, 0.12)' 
          }}
        >
          {/* Author Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full border flex items-center justify-center font-bold text-lg text-white"
                style={{ backgroundColor: theme.primary, borderColor: `${theme.primary}80` }}
              >
                {data.authorName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-slate-100 text-base">
                  <span>{data.authorName}</span>
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
                </div>
                <div className="text-xs text-slate-400 font-mono">@{data.authorHandle}</div>
              </div>
            </div>

            <div className="text-slate-500">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>

          {/* Tweet Text */}
          <p className="text-lg md:text-xl text-slate-100 leading-relaxed font-normal my-4">
            {data.bodyText}
          </p>

          <div className="text-xs text-slate-500 font-mono py-3 border-y border-white/10">
            {data.timestamp} • Yuwbrndr for Web
          </div>

          {/* Tweet Metrics */}
          <div className="flex items-center justify-between pt-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5 hover:text-indigo-400">
              <MessageCircle className="w-4 h-4" />
              <span>248</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-emerald-400">
              <Repeat2 className="w-4 h-4" />
              <span>{data.retweets}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-rose-400">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>{data.likes}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Share className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* 3. Classic Top/Bottom Meme */}
      {data.template === 'classic' && (
        <div 
          className="relative z-10 w-full max-w-lg aspect-square rounded-2xl border overflow-hidden flex flex-col justify-between p-6 shadow-2xl"
          style={{ 
            borderColor: 'rgba(255, 255, 255, 0.15)',
            background: data.bgImageUrl ? `url(${data.bgImageUrl}) center/cover no-repeat` : 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)'
          }}
        >
          {/* Dark scrim overlay */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />

          {/* Top Text */}
          <div className="relative z-10 text-center">
            <h2 
              className="font-meme uppercase tracking-wider text-white meme-text-stroke leading-none"
              style={{ fontSize: `${data.fontSize || 42}px` }}
            >
              {data.topText}
            </h2>
          </div>

          {/* Middle Placeholder graphic if no custom image */}
          {!data.bgImageUrl && (
            <div className="relative z-10 my-auto text-center opacity-30">
              <div className="text-7xl font-mono font-black text-white/40">&lt; / &gt;</div>
            </div>
          )}

          {/* Bottom Text */}
          <div className="relative z-10 text-center">
            <h2 
              className="font-meme uppercase tracking-wider text-white meme-text-stroke leading-none"
              style={{ fontSize: `${data.fontSize || 42}px` }}
            >
              {data.bottomText}
            </h2>
          </div>
        </div>
      )}

      {/* 4. Split Comparison / Dilemma */}
      {data.template === 'split-vs' && (
        <div className="relative z-10 w-full max-w-3xl grid grid-cols-2 gap-4 md:gap-6">
          {/* Left Choice */}
          <div 
            className="p-6 md:p-8 rounded-3xl border flex flex-col justify-between text-center relative overflow-hidden"
            style={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.8)', 
              borderColor: 'rgba(244, 63, 94, 0.3)' 
            }}
          >
            <div className="inline-block mx-auto px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 mb-4">
              {data.splitLeftLabel}
            </div>
            <p className="text-base md:text-xl font-bold text-slate-200 my-auto">
              "{data.splitLeftText}"
            </p>
            <div className="mt-4 text-xs font-mono text-slate-500">
              ❌ NOT IDEAL
            </div>
          </div>

          {/* Right Choice */}
          <div 
            className="p-6 md:p-8 rounded-3xl border flex flex-col justify-between text-center relative overflow-hidden shadow-2xl"
            style={{ 
              backgroundColor: 'rgba(16, 24, 39, 0.9)', 
              borderColor: 'rgba(16, 185, 129, 0.5)' 
            }}
          >
            <div className="inline-block mx-auto px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-4">
              {data.splitRightLabel}
            </div>
            <p className="text-base md:text-xl font-bold text-white my-auto">
              "{data.splitRightText}"
            </p>
            <div className="mt-4 text-xs font-mono text-emerald-400 font-semibold">
              ✅ CHAD MOVE
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
