import { toPng, toBlob } from 'html-to-image';

export interface ExportOptions {
  scale?: 1 | 2 | 4;
  fileName?: string;
  transparent?: boolean;
}

function findPreviewFrame(element: HTMLElement): HTMLIFrameElement | null {
  return element.querySelector('iframe[data-yuwbrndr-preview]');
}

async function canvasFrameDataUrl(frame: HTMLIFrameElement, scale: number): Promise<string> {
  const requestId = crypto.randomUUID();
  const frameId = frame.dataset.frameId;
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      window.removeEventListener('message', receive);
      reject(new Error('Sandboxed canvas export timed out.'));
    }, 5000);
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.contentWindow || event.data?.requestId !== requestId) return;
      if (event.data?.type !== 'export-result' && event.data?.type !== 'export-error') return;
      window.clearTimeout(timeout);
      window.removeEventListener('message', receive);
      if (event.data.type === 'export-error') reject(new Error(event.data.message));
      else resolve(event.data.dataUrl);
    };
    window.addEventListener('message', receive);
    frame.contentWindow?.postMessage({ type: 'yuwbrndr-export', requestId, frameId, scale }, '*');
  });
}

async function renderElement(element: HTMLElement, scale: number): Promise<string> {
  const frame = findPreviewFrame(element);
  if (!frame) return toPng(element, { pixelRatio: scale, cacheBust: true });
  if (frame.dataset.yuwbrndrPreview === 'canvas') return canvasFrameDataUrl(frame, scale);
  const body = frame.contentDocument?.body;
  if (!body) throw new Error('HTML preview is not ready for export.');
  return toPng(body, { pixelRatio: scale, cacheBust: true });
}

export async function renderElementAsPngBlob(
  element: HTMLElement,
  scale: 1 | 2 | 4 = 2
): Promise<Blob> {
  const dataUrl = await renderElement(element, scale);
  const response = await fetch(dataUrl);
  return response.blob();
}

/**
 * Downloads a DOM element as a high-DPI PNG image
 */
export async function exportElementAsPng(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  const { scale = 2, fileName = 'yuwbrndr-export.png' } = options;

  try {
    const dataUrl = await renderElement(element, scale);

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
    const frame = findPreviewFrame(element);
    let blob: Blob | null;
    if (frame) {
      const dataUrl = frame.dataset.yuwbrndrPreview === 'canvas'
        ? await canvasFrameDataUrl(frame, scale)
        : await renderElement(element, scale);
      blob = await fetch(dataUrl).then((response) => response.blob());
    } else {
      blob = await toBlob(element, { pixelRatio: scale, cacheBust: true });
    }

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
