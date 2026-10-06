import React, { useState, useRef, useEffect } from 'react';

export interface AarSelectOption {
  value: string;
  label: string;
  shortLabel?: string;
}

export interface AarSelectProps {
  label?: string;
  value: string;
  options: AarSelectOption[];
  onChange: (value: string) => void;
  style?: React.CSSProperties;
  compact?: boolean;
  menuAlign?: 'left' | 'right';
}

export const AarSelect: React.FC<AarSelectProps> = ({
  label,
  value,
  options,
  onChange,
  style,
  compact = false,
  menuAlign = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('pointerdown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div
      className={label ? 'aar-field' : undefined}
      style={{ minWidth: compact ? '8.5rem' : '11rem', ...style }}
    >
      {label && <span className="aar-label">{label}</span>}
      <div className="aar-dropdown" data-open={isOpen} ref={containerRef}>
        <button
          type="button"
          className="aar-dropdown-trigger"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          style={compact ? { padding: '0.35rem 0.65rem', height: '2.125rem', fontSize: '0.8125rem' } : undefined}
        >
          <span>{(compact && selectedOption?.shortLabel) ? selectedOption.shortLabel : selectedOption?.label}</span>
          <span className="aar-dropdown-arrow" aria-hidden="true">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div
            className="aar-dropdown-menu"
            role="listbox"
            style={menuAlign === 'right' ? { left: 'auto', right: 0, minWidth: 'max-content' } : undefined}
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className="aar-dropdown-item"
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
