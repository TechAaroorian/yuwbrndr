import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportElementAsPng, downloadSvgString } from './exportImage';

describe('exportImage utility', () => {
  let listeners: Record<string, ((event: any) => void)[]> = {};

  beforeEach(() => {
    listeners = {};

    vi.stubGlobal('window', {
      setTimeout: (fn: () => void, ms: number) => setTimeout(fn, ms),
      clearTimeout: (id: any) => clearTimeout(id),
      addEventListener: (type: string, cb: (e: any) => void) => {
        listeners[type] = listeners[type] || [];
        listeners[type].push(cb);
      },
      removeEventListener: (type: string, cb: (e: any) => void) => {
        if (!listeners[type]) return;
        listeners[type] = listeners[type].filter((fn) => fn !== cb);
      },
    });

    vi.stubGlobal('crypto', {
      randomUUID: () => 'test-uuid-1234',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('downloadSvgString creates an object URL and triggers download', () => {
    const createObjectURLMock = vi.fn().mockReturnValue('blob:test-svg-url');
    const revokeObjectURLMock = vi.fn();
    const clickMock = vi.fn();

    vi.stubGlobal('URL', {
      createObjectURL: createObjectURLMock,
      revokeObjectURL: revokeObjectURLMock,
    });

    const mockAnchor = {
      href: '',
      download: '',
      click: clickMock,
    };

    vi.stubGlobal('document', {
      createElement: (tag: string) => {
        if (tag === 'a') return mockAnchor;
        return {};
      },
    });

    downloadSvgString('<svg></svg>', 'test-output.svg');

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:test-svg-url');
  });

  it('exports canvas frame when preview iframe responds with export-result', async () => {
    const clickMock = vi.fn();
    const mockAnchor = {
      href: '',
      download: '',
      click: clickMock,
    };

    vi.stubGlobal('document', {
      createElement: (tag: string) => {
        if (tag === 'a') return mockAnchor;
        return {};
      },
    });

    let mockContentWindow: any;
    mockContentWindow = {
      postMessage: vi.fn((data: any) => {
        if (data?.type === 'yuwbrndr-export') {
          // Trigger the message event listener
          const event = {
            source: mockContentWindow,
            data: {
              source: 'yuwbrndr-preview',
              frameId: data.frameId,
              requestId: data.requestId,
              type: 'export-result',
              dataUrl: 'data:image/png;base64,mockPngContent',
            },
          };
          (listeners['message'] || []).forEach((fn) => fn(event));
        }
      }),
    };

    const mockIframe = {
      dataset: {
        yuwbrndrPreview: 'canvas',
        frameId: 'preview-test-123',
      },
      contentWindow: mockContentWindow,
    };

    const mockContainer = {
      style: { width: '1200px', height: '675px' },
      offsetWidth: 1200,
      offsetHeight: 675,
      querySelector: (selector: string) => {
        if (selector === 'iframe[data-yuwbrndr-preview]') return mockIframe;
        return null;
      },
    } as unknown as HTMLElement;

    await exportElementAsPng(mockContainer, {
      scale: 2,
      fileName: 'custom-export.png',
    });

    expect(mockContentWindow.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'yuwbrndr-export',
        frameId: 'preview-test-123',
        scale: 2,
      }),
      '*'
    );
    expect(mockAnchor.download).toBe('custom-export.png');
    expect(mockAnchor.href).toBe('data:image/png;base64,mockPngContent');
    expect(clickMock).toHaveBeenCalled();
  });

  it('rejects with error when canvas frame responds with export-error', async () => {
    let mockContentWindow: any;
    mockContentWindow = {
      postMessage: vi.fn((data: any) => {
        if (data?.type === 'yuwbrndr-export') {
          const event = {
            source: mockContentWindow,
            data: {
              source: 'yuwbrndr-preview',
              frameId: data.frameId,
              requestId: data.requestId,
              type: 'export-error',
              message: 'Canvas is tainted by insecure asset',
            },
          };
          (listeners['message'] || []).forEach((fn) => fn(event));
        }
      }),
    };

    const mockIframe = {
      dataset: {
        yuwbrndrPreview: 'canvas',
        frameId: 'preview-err-456',
      },
      contentWindow: mockContentWindow,
    };

    const mockContainer = {
      style: { width: '1200px', height: '675px' },
      offsetWidth: 1200,
      offsetHeight: 675,
      querySelector: (selector: string) => {
        if (selector === 'iframe[data-yuwbrndr-preview]') return mockIframe;
        return null;
      },
    } as unknown as HTMLElement;

    await expect(
      exportElementAsPng(mockContainer, {
        scale: 1,
        fileName: 'err.png',
      })
    ).rejects.toThrow('Canvas is tainted by insecure asset');
  });
});
