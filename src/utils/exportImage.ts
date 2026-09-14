import { toPng, toBlob } from 'html-to-image';

export interface ExportOptions {
  scale?: 1 | 2 | 4;
  fileName?: string;
  transparent?: boolean;
}

/**
 * Downloads a DOM element as a high-DPI PNG image
 */
export async function exportElementAsPng(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  const { scale = 2, fileName = 'yuwbrndr-export.png', transparent = false } = options;

  try {
    const dataUrl = await toPng(element, {
      pixelRatio: scale,
      cacheBust: true,
      backgroundColor: transparent ? undefined : undefined,
    });

    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Failed to export PNG:', error);
    throw error;
  }
}

/**
 * Copies a rendered DOM element directly to the user's system clipboard as an image
 */
export async function copyElementToClipboard(
  element: HTMLElement,
  scale: 1 | 2 = 2
): Promise<boolean> {
  try {
    const blob = await toBlob(element, {
      pixelRatio: scale,
      cacheBust: true,
    });

    if (!blob) throw new Error('Blob generation failed');

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);

    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Downloads a raw SVG string as an .svg file
 */
export function downloadSvgString(svgString: string, fileName = 'yuwbrndr-vector.svg') {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
