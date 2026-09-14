import React from 'react';
import { SvgGraphicConfig, ColorTheme } from '../../../types/studio';
import { ShieldCheck, Code2, Sparkles, Hash } from 'lucide-react';

interface Props {
  config: SvgGraphicConfig;
  theme: ColorTheme;
  svgRef?: React.RefObject<SVGSVGElement | null>;
}

export const SvgCanvas: React.FC<Props> = ({ config, theme, svgRef }) => {
  return (
    <div 
      className="w-full h-full relative overflow-hidden flex flex-col justify-between p-8 md:p-12 select-none"
      style={{ backgroundColor: theme.background }}
    >
      {/* Background ambient lighting */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none opacity-20"
        style={{ backgroundColor: config.color1 || theme.primary }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between border-b pb-4" style={{ borderColor: theme.border }}>
        <div>
          <div 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase border mb-2"
            style={{ 
              backgroundColor: `${theme.primary}20`, 
              borderColor: `${theme.primary}50`,
              color: theme.accent 
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            STANDALONE SVG VECTOR
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">{config.title}</h2>
          <p className="text-sm text-slate-400">{config.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono"
          style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.muted }}>
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span className="uppercase">SVG 1.1 VECTOR</span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative z-10 my-auto flex items-center justify-center p-4">
        {/* 1. Mesh Gradient Card */}
        {config.template === 'mesh-gradient-card' && (
          <svg
            ref={svgRef}
            viewBox="0 0 800 400"
            className="w-full max-w-2xl h-auto rounded-2xl shadow-2xl border border-white/10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="meshGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={config.color1 || theme.primary} stopOpacity="0.8" />
                <stop offset="50%" stopColor={config.color2 || theme.secondary} stopOpacity="0.6" />
                <stop offset="100%" stopColor={config.color3 || theme.accent} stopOpacity="0.9" />
              </linearGradient>
              <radialGradient id="meshRadial1" cx="30%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
              </radialGradient>
              <filter id="noiseFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0" />
              </filter>
            </defs>

            {/* Base gradient rect */}
            <rect width="800" height="400" rx="16" fill="url(#meshGrad1)" />
            {/* Radial overlay */}
            <rect width="800" height="400" rx="16" fill="url(#meshRadial1)" />
            {/* Subtle grain/noise */}
            <rect width="800" height="400" rx="16" filter="url(#noiseFilter)" />

            {/* Foreground decorative rings */}
            <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="6 6" />
            <circle cx="200" cy="200" r="90" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
            <circle cx="600" cy="200" r="160" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />

            {/* Typography in SVG */}
            <text x="400" y="190" textAnchor="middle" fill="#ffffff" fontSize="34" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="-0.5">
              {config.badgeText || 'Modern Mesh Card'}
            </text>
            <text x="400" y="235" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="16" fontFamily="monospace">
              SCALABLE VECTOR GRAPHIC • 100% OPEN SOURCE
            </text>
          </svg>
        )}

        {/* 2. Modern Tech Badge */}
        {config.template === 'tech-badge' && (
          <svg
            ref={svgRef}
            viewBox="0 0 600 300"
            className="w-full max-w-xl h-auto rounded-3xl shadow-2xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="badgeBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={config.color1 || theme.primary} />
                <stop offset="100%" stopColor={config.color2 || theme.secondary} />
              </linearGradient>
            </defs>

            {/* Card Background */}
            <rect x="10" y="10" width="580" height="280" rx="20" fill="#0d111d" stroke="url(#badgeBorder)" strokeWidth="2" />

            {/* Cyber Corner Decors */}
            <path d="M 25 15 L 15 15 L 15 25" fill="none" stroke={config.color1 || theme.primary} strokeWidth="3" />
            <path d="M 575 15 L 585 15 L 585 25" fill="none" stroke={config.color1 || theme.primary} strokeWidth="3" />
            <path d="M 15 275 L 15 285 L 25 285" fill="none" stroke={config.color2 || theme.secondary} strokeWidth="3" />
            <path d="M 585 275 L 585 285 L 575 285" fill="none" stroke={config.color2 || theme.secondary} strokeWidth="3" />

            {/* Center Pill */}
            <rect x="160" y="70" width="280" height="40" rx="20" fill={`${config.color1 || theme.primary}25`} stroke={config.color1 || theme.primary} strokeWidth="1" />
            <text x="300" y="96" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="600" fontFamily="monospace">
              ⚡ VERIFIED REPOSITORY
            </text>

            {/* Badge Title */}
            <text x="300" y="165" textAnchor="middle" fill="#ffffff" fontSize="28" fontWeight="800" fontFamily="system-ui, sans-serif">
              {config.badgeText || 'PRODUCTION READY'}
            </text>

            {/* Hash Footnote */}
            <text x="300" y="210" textAnchor="middle" fill="#94a3b8" fontSize="13" fontFamily="monospace">
              SHA: e8f91b2c4a93d07e • MIT LICENSED
            </text>
          </svg>
        )}

        {/* 3. Abstract Wave Banner */}
        {config.template === 'abstract-wave' && (
          <svg
            ref={svgRef}
            viewBox="0 0 900 350"
            className="w-full max-w-2xl h-auto rounded-2xl shadow-2xl border border-white/10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={config.color1 || theme.primary} stopOpacity="0.8" />
                <stop offset="100%" stopColor={config.color2 || theme.secondary} stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={config.color2 || theme.secondary} stopOpacity="0.6" />
                <stop offset="100%" stopColor={config.color3 || theme.accent} stopOpacity="0.2" />
              </linearGradient>
            </defs>

            <rect width="900" height="350" fill="#090a12" rx="16" />

            {/* Wave Layers */}
            <path
              d="M 0 250 C 200 180, 400 320, 600 220 C 750 150, 850 240, 900 200 L 900 350 L 0 350 Z"
              fill="url(#waveGrad1)"
            />
            <path
              d="M 0 280 C 180 230, 380 340, 580 260 C 720 200, 820 290, 900 250 L 900 350 L 0 350 Z"
              fill="url(#waveGrad2)"
            />

            <text x="80" y="110" fill="#ffffff" fontSize="32" fontWeight="800" fontFamily="system-ui, sans-serif">
              {config.badgeText || 'Generative Vector Wave'}
            </text>
            <text x="80" y="150" fill="#94a3b8" fontSize="16" fontFamily="monospace">
              Parametric SVG curves for headers and cards
            </text>
          </svg>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono pt-4 border-t" style={{ borderColor: theme.border, color: theme.muted }}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>ZERO EXTERNAL ASSETS • 100% PURE SVG</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5" />
          <span>STANDALONE VECTOR</span>
        </div>
      </div>
    </div>
  );
};
