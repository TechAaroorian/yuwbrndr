import { toPng } from 'html-to-image';

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

/**
 * Converts a blob: or relative URL into a base64 Data URL so SVG foreignObject
 * rendering can safely bundle it without query-string cacheBust errors or CORS issues.
 */
async function blobToDataUrl(blobUrl: string): Promise<string> {
  try {
    const res = await fetch(blobUrl);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject(new Error('FileReader did not return a string'));
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn('Failed to convert blob URL to data URL:', blobUrl, err);
    return blobUrl;
  }
}

/**
 * Traverses root element and inlines all blob: URLs (images and background-image styles)
 * into self-contained data URLs so html-to-image and SVG foreignObject can render them
 * without security policy blocks or query-string cacheBust errors.
 * Returns a restore function that reverts elements to their original URLs.
 */
async function inlineBlobUrls(root: HTMLElement): Promise<() => void> {
  const restorations: Array<() => void> = [];
  const blobRegex = /url\(["']?(blob:[^"')]+)["']?\)/gi;

  const elements: HTMLElement[] = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))];
  for (const el of elements) {
    // 1. Process inline background or backgroundImage styles
    const inlineBg = el.style.backgroundImage || el.style.background;
    if (inlineBg && /blob:/i.test(inlineBg)) {
      const prevBg = el.style.backgroundImage;
      const prevAllBg = el.style.background;
      let replacedBg = inlineBg;
      const matches = Array.from(inlineBg.matchAll(blobRegex));
      for (const match of matches) {
        const full = match[0];
        const blobUrl = match[1];
        const dataUrl = await blobToDataUrl(blobUrl);
        replacedBg = replacedBg.replace(full, `url("${dataUrl}")`);
      }
      el.style.backgroundImage = replacedBg;
      restorations.push(() => {
        el.style.backgroundImage = prevBg;
        if (prevAllBg && !prevBg) el.style.background = prevAllBg;
      });
    }

    // 2. Also check computed background-image if inline style is empty
    if (!el.style.backgroundImage && !el.style.background) {
      try {
        const view = el.ownerDocument.defaultView || window;
        const computed = view.getComputedStyle(el);
        const compBg = computed?.backgroundImage;
        if (compBg && /blob:/i.test(compBg)) {
          let replacedBg = compBg;
          const matches = Array.from(compBg.matchAll(blobRegex));
          for (const match of matches) {
            const full = match[0];
            const blobUrl = match[1];
            const dataUrl = await blobToDataUrl(blobUrl);
            replacedBg = replacedBg.replace(full, `url("${dataUrl}")`);
          }
          el.style.backgroundImage = replacedBg;
          restorations.push(() => {
            el.style.backgroundImage = '';
          });
        }
      } catch {
        // Ignore computed style errors
      }
    }

    // 3. Process <img> elements
    if (el instanceof HTMLImageElement && el.src && el.src.startsWith('blob:')) {
      const prevSrc = el.src;
      const dataUrl = await blobToDataUrl(prevSrc);
      el.src = dataUrl;
      restorations.push(() => {
        el.src = prevSrc;
      });
    }
  }

  return () => {
    for (const restore of restorations) {
      try {
        restore();
      } catch {
        // Ignore restore errors
      }
    }
  };
}

async function renderElement(element: HTMLElement, scale: number): Promise<string> {
  const targetWidth = parseInt(element.style.width, 10) || element.offsetWidth || 1200;
  const targetHeight = parseInt(element.style.height, 10) || element.offsetHeight || 675;

  const frame = findPreviewFrame(element);
  if (frame && frame.dataset.yuwbrndrPreview === 'canvas') {
    return canvasFrameDataUrl(frame, scale);
  }

  const target = (frame ? frame.contentDocument?.body : element) || element;

  const doc = target.ownerDocument;
  if (doc?.fonts?.ready) {
    try {
      await doc.fonts.ready;
    } catch {
      // Non-fatal if font loading check rejects
    }
  }

  const restoreBlobs = await inlineBlobUrls(target);

  try {
    return await toPng(target, {
      width: targetWidth,
      height: targetHeight,
      canvasWidth: targetWidth * scale,
      canvasHeight: targetHeight * scale,
      pixelRatio: scale,
      cacheBust: false,
      style: {
        transform: 'none',
        width: `${targetWidth}px`,
        height: `${targetHeight}px`,
        margin: '0',
        overflow: 'hidden',
      },
    });
  } finally {
    restoreBlobs();
  }
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
    const dataUrl = await renderElement(element, scale);
    const response = await fetch(dataUrl);
    const blob = await response.blob();
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
