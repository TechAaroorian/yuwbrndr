import { describe, it, expect } from 'vitest';
import {
  encodeShareUrl,
  decodeShareUrl,
  hasLocalUploadedImages,
  ShareUrlError,
  SharePayload,
} from './shareUrl';

describe('shareUrl utility', () => {
  it('should encode and decode an HTML share payload correctly', async () => {
    const payload: SharePayload = {
      t: 'html',
      c: '<div class="p-8 bg-slate-900 text-white"><h1>Hello World</h1></div>',
      p: 'linkedin-banner',
      th: 'midnight',
    };

    const encoded = await encodeShareUrl(payload);
    expect(encoded).toBeDefined();
    expect(typeof encoded).toBe('string');
    expect(encoded.length).toBeGreaterThan(0);

    const hashString = `#share=${encoded}`;
    const decoded = await decodeShareUrl(hashString);

    expect(decoded.t).toBe(payload.t);
    expect(decoded.c).toBe(payload.c);
    expect(decoded.p).toBe(payload.p);
    expect(decoded.th).toBe(payload.th);
  });

  it('should encode and decode a Canvas JS share payload correctly', async () => {
    const payload: SharePayload = {
      t: 'canvas',
      c: 'ctx.fillStyle = "#38bdf8";\nctx.fillRect(0, 0, width, height);',
      p: 'x-post',
      th: 'matrix',
    };

    const encoded = await encodeShareUrl(payload);
    const hashString = `share=${encoded}`;
    const decoded = await decodeShareUrl(hashString);

    expect(decoded.t).toBe('canvas');
    expect(decoded.c).toBe(payload.c);
    expect(decoded.p).toBe('x-post');
    expect(decoded.th).toBe('matrix');
  });

  it('should throw ShareUrlError if share parameter is missing', async () => {
    await expect(decodeShareUrl('#other=123')).rejects.toThrow(ShareUrlError);
    await expect(decodeShareUrl('')).rejects.toThrow('missing its design data');
  });

  it('should throw ShareUrlError for corrupted/malformed share string', async () => {
    await expect(decodeShareUrl('#share=v1z.!!!invalid-base64???')).rejects.toThrow(ShareUrlError);
  });

  describe('hasLocalUploadedImages', () => {
    it('should return false for code with web URLs or no images', () => {
      const code1 = '<div class="bg-indigo-600">No images here</div>';
      const code2 = '<img src="https://images.unsplash.com/photo-1234" alt="web" />';
      expect(hasLocalUploadedImages([], null, code1)).toBe(false);
      expect(hasLocalUploadedImages([], null, code2)).toBe(false);
    });

    it('should return true if code contains blob: URLs', () => {
      const code = '<img src="blob:http://localhost:5173/abc-123-uuid" alt="local" />';
      expect(hasLocalUploadedImages([], null, code)).toBe(true);
    });

    it('should return true if userImage is provided', () => {
      expect(hasLocalUploadedImages([], 'blob:user-img', '')).toBe(true);
    });

    it('should return true if uploadedAssets array contains items', () => {
      const assets = [
        {
          id: '1',
          name: 'logo.png',
          url: 'blob:http://localhost/1',
          size: 1024,
          type: 'image/png',
          createdAt: Date.now(),
        },
      ];
      expect(hasLocalUploadedImages(assets, null, '')).toBe(true);
    });
  });
});
