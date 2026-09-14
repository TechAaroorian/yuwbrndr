import React from 'react';
import { InfographicData, ColorTheme } from '../../../types/studio';
import { 
  TrendingUp, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Database,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

interface Props {
  data: InfographicData;
  theme: ColorTheme;
}

const iconMap: Record<string, React.ElementType> = {
  trending: TrendingUp,
  activity: Activity,
  cpu: Cpu,
  shield: ShieldCheck,
  zap: Zap,
  database: Database,
  sparkles: Sparkles,
};

export const InfographicCanvas: React.FC<Props> = ({ data, theme }) => {
  return (
    <div 
      className="w-full h-full relative overflow-hidden flex flex-col justify-between p-10 md:p-14 select-none"
      style={{ 
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      {/* Background ambient decorative glows */}
      <div 
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25"
        style={{ backgroundColor: theme.primary }}
      />
      <div 
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: theme.secondary }}
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex items-start justify-between border-b pb-6" style={{ borderColor: theme.border }}>
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border"
            style={{ 
              backgroundColor: `${theme.primary}15`, 
              borderColor: `${theme.primary}40`,
              color: theme.accent 
            }}>
            <Sparkles className="w-3.5 h-3.5" />
            {data.tag}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {data.title}
          </h1>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: theme.muted }}>
            {data.subtitle}
          </p>
        </div>

        {/* Studio watermark tag */}
        <div className="hidden sm:flex flex-col items-end text-xs font-mono" style={{ color: theme.muted }}>
          <span className="font-semibold text-slate-300">YUWBRNDR</span>
          <span className="opacity-60">OPEN-SOURCE INFOGRAPHIC</span>
        </div>
      </div>

      {/* Dynamic Content Area based on Template */}
      <div className="relative z-10 my-auto py-6">
        {data.template === 'bento' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {data.bentoItems.map((item, idx) => {
              const IconComp = iconMap[item.icon] || Activity;
              const isHero = idx === 0;
              return (
                <div
                  key={item.id}
                  className={`p-5 md:p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                    isHero ? 'col-span-2 row-span-1 shadow-lg' : ''
                  }`}
                  style={{
                    backgroundColor: isHero ? `${theme.primary}12` : theme.surface,
                    borderColor: isHero ? `${theme.primary}50` : theme.border,
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="p-2.5 rounded-xl border"
                      style={{ 
                        backgroundColor: `${theme.primary}20`,
                        borderColor: `${theme.primary}40`,
                        color: theme.accent
                      }}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span 
                      className="inline-flex items-center text-xs font-mono font-medium px-2 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: `${theme.secondary}15`, 
                        color: theme.secondary 
                      }}
                    >
                      <ArrowUpRight className="w-3 h-3 mr-0.5" />
                      {item.change}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs uppercase font-semibold tracking-wider mb-1" style={{ color: theme.muted }}>
                      {item.title}
                    </div>
                    <div className="text-2xl md:text-4xl font-extrabold font-mono tracking-tight my-1">
                      {item.value}
                    </div>
                    <p className="text-xs leading-normal line-clamp-2" style={{ color: theme.muted }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {data.template === 'timeline' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {data.timelineItems.map((item, i) => (
              <div 
                key={i}
                className="p-5 rounded-2xl border flex flex-col justify-between relative overflow-hidden"
                style={{ 
                  backgroundColor: theme.surface,
                  borderColor: theme.border 
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span 
                    className="font-mono text-xs font-bold px-2 py-0.5 rounded-md border"
                    style={{ 
                      backgroundColor: `${theme.primary}20`, 
                      borderColor: `${theme.primary}50`,
                      color: theme.accent 
                    }}
                  >
                    STEP {item.step}
                  </span>
                  {item.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Clock className="w-4 h-4" style={{ color: theme.muted }} />
                  )}
                </div>
                <div className="mt-2">
                  <h3 className="font-bold text-base md:text-lg mb-1">{item.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: theme.muted }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {data.template === 'comparison' && (
          <div className="grid grid-cols-2 gap-6">
            {/* Left Card */}
            <div 
              className="p-6 md:p-8 rounded-2xl border flex flex-col justify-between"
              style={{ backgroundColor: theme.surface, borderColor: theme.border }}
            >
              <div className="text-xl font-bold pb-3 border-b" style={{ borderColor: theme.border }}>
                {data.comparison.leftTitle}
              </div>
              <ul className="space-y-3 my-4">
                {data.comparison.leftItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="text-xs font-mono opacity-60" style={{ color: theme.muted }}>
                Standard Flow
              </div>
            </div>

            {/* Right Card (Highlighted) */}
            <div 
              className="p-6 md:p-8 rounded-2xl border flex flex-col justify-between relative shadow-xl"
              style={{ 
                backgroundColor: `${theme.primary}15`, 
                borderColor: `${theme.primary}60` 
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: `${theme.primary}40` }}>
                <div className="text-xl font-bold text-white">
                  {data.comparison.rightTitle}
                </div>
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Recommended
                </span>
              </div>
              <ul className="space-y-3 my-4">
                {data.comparison.rightItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="text-xs font-mono font-semibold" style={{ color: theme.accent }}>
                Enhanced Performance & Security
              </div>
            </div>
          </div>
        )}

        {data.template === 'stat-highlight' && (
          <div 
            className="p-8 md:p-12 rounded-3xl border text-center flex flex-col items-center justify-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden"
            style={{ 
              backgroundColor: theme.surface, 
              borderColor: `${theme.primary}50` 
            }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold mb-4"
              style={{ backgroundColor: `${theme.primary}20`, color: theme.accent }}>
              <TrendingUp className="w-4 h-4" />
              {data.statHighlight.growth}
            </div>
            <div className="text-6xl md:text-8xl font-black font-mono tracking-tight my-2" style={{ color: theme.text }}>
              {data.statHighlight.number}
              <span className="text-4xl md:text-5xl ml-1 font-bold" style={{ color: theme.accent }}>
                {data.statHighlight.unit}
              </span>
            </div>
            <div className="text-lg md:text-xl font-semibold mt-2">{data.statHighlight.metricLabel}</div>
            <div className="text-xs md:text-sm mt-3 max-w-md" style={{ color: theme.muted }}>
              {data.statHighlight.footnote}
            </div>
          </div>
        )}
      </div>

      {/* Footer Bar */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono pt-4 border-t" style={{ borderColor: theme.border, color: theme.muted }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>REALTIME COMPILED • PURE WEB SVG/DOM</span>
        </div>
        <div>
          <span>ybrndr.dev • 100% OPEN-SOURCE</span>
        </div>
      </div>
    </div>
  );
};
