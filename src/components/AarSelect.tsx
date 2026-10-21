import { useId } from 'react';
import type { CSSProperties } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AarSelectOption { value: string; label: string; shortLabel?: string }
export interface AarSelectProps {
  label?: string; value: string; options: AarSelectOption[];
  onChange: (value: string) => void; style?: CSSProperties;
  compact?: boolean; menuAlign?: 'left' | 'right';
}
export function AarSelect({ label, value, options, onChange, style, compact = false }: AarSelectProps) {
  const id = useId();
  return <div className={label ? 'aar-field' : 'aar-select-frame'} style={style}>
    {label && <label className="aar-label" htmlFor={id}>{label}</label>}
    <span className="aar-select-frame">
      <select id={id} className="aar-select" data-size={compact ? 'sm' : undefined}
        aria-label={label || 'Appearance'} value={value} onChange={event => onChange(event.target.value)}>
        {options.map(option => <option key={option.value} value={option.value}>{compact ? option.shortLabel || option.label : option.label}</option>)}
      </select>
      <ChevronDown className="aar-select-chevron" aria-hidden="true" />
    </span>
  </div>;
}
