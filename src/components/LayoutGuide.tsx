import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
export const layoutDecisions = [
  ['Canvas first', 'The output is the task. A large, uninterrupted preview lets you judge composition before changing implementation details.'],
  ['One supporting dock', 'Code, Templates and Assets are ways to work on the same design. Sharing one region reduces competing panels and leaves more room for the result.'],
  ['Task header', 'Graphic or Slides changes the document model. Export completes the task, so it is the strongest command. Preferences, sharing and help stay in Studio actions.'],
  ['Controls beside their subject', 'Format, fit and zoom belong to the preview. Canvas colors belong to Templates; font and image resources belong to Assets. This keeps application appearance separate from authored content.'],
  ['Responsive composition', 'Wide workspaces show canvas and dock together. Medium workspaces stack the dock below the canvas. Phones switch between Canvas and Tools, preserving a readable working width. No tool is discarded.'],
  ['Focus when needed', 'The dock can close for a larger preview, or focus Code for longer edits. These are explicit choices, not automatic hiding. Ctrl+B toggles tools.'],
  ['Paper and readable ink', 'Sage identifies Templates, lavender identifies Code, clay identifies Assets, and ochre groups guidance. Spacing and labels keep those regions meaningful without relying on color. Borders identify controls or overlaps rather than framing every region. Text and labels remain the primary signals.'],
  ['State survives view changes', 'Switching tools preserves the document, assets, editor and selected slide. Keyboard tabs, visible focus, native menus and reduced motion support predictable interaction.'],
] as const;
export function LayoutGuide({open, onClose}: {open: boolean; onClose: () => void}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; if (!dialog) return; if (open && !dialog.open) dialog.showModal(); else if (!open && dialog.open) dialog.close(); }, [open]);
  return <dialog ref={ref} className="aar-dialog" aria-labelledby="layout-guide-title" onClose={onClose}>
    <div className="aar-cluster" data-gap="4"><h2 id="layout-guide-title" className="aar-heading">Why this layout?</h2><button className="aar-icon-button" data-variant="quiet" aria-label="Close layout guide" onClick={onClose} data-size="sm"><X size={18}/></button></div>
    <p className="aar-text-muted">Aar Loom: paper groups content, ink communicates, motion explains change.</p>
    <div className="aar-stack" data-gap="6">{layoutDecisions.map(([title, reason]) => <section key={title}><h3 className="aar-heading">{title}</h3><p>{reason}</p></section>)}</div>
  </dialog>;
}
