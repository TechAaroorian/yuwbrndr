import { UploadedAsset } from '../types/studio';

export interface SharePayload {
  t: 'html' | 'canvas';
  c: string;
  p: string;
  th: string;
}

// Convert binary Uint8Array to URL-safe Base64 string
function bytesToUrlSafeBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Convert URL-safe Base64 string back to Uint8Array
function urlSafeBase64ToBytes(base64: string): Uint8Array {
  let standard = base64.replace(/-/g, '+').replace(/_/g, '/');
  while (standard.length % 4 !== 0) {
    standard += '=';
  }
  const binary = atob(standard);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Compresses and encodes SharePayload into a URL-safe string.
 * Uses native browser CompressionStream with zero external libraries.
 */
export async function encodeShareUrl(payload: SharePayload): Promise<string> {
  const json = JSON.stringify(payload);

  if (typeof CompressionStream !== 'undefined') {
    const stream = new Blob([new TextEncoder().encode(json) as unknown as BlobPart])
      .stream()
      .pipeThrough(new CompressionStream('deflate-raw'));
    const compressedBuffer = await new Response(stream).arrayBuffer();
    return bytesToUrlSafeBase64(new Uint8Array(compressedBuffer));
  }

  // Safe fallback if CompressionStream is absent
  return bytesToUrlSafeBase64(new TextEncoder().encode(json));
}

/**
 * Decodes and decompresses a URL hash string back into a SharePayload.
 */
export async function decodeShareUrl(hashString: string): Promise<SharePayload | null> {
  try {
    const raw = hashString.replace(/^#?(share=)?/, '').trim();
    if (!raw) return null;

    const bytes = urlSafeBase64ToBytes(raw);

    let json = '';
    if (typeof DecompressionStream !== 'undefined') {
      try {
        const stream = new Blob([bytes as unknown as BlobPart])
          .stream()
          .pipeThrough(new DecompressionStream('deflate-raw'));
        json = await new Response(stream).text();
      } catch {
        json = new TextDecoder().decode(bytes);
      }
    } else {
      json = new TextDecoder().decode(bytes);
    }

    const parsed = JSON.parse(json);
    if (
      parsed &&
      typeof parsed.c === 'string' &&
      (parsed.t === 'html' || parsed.t === 'canvas')
    ) {
      return {
        t: parsed.t,
        c: parsed.c,
        p: typeof parsed.p === 'string' ? parsed.p : 'twitter-post',
        th: typeof parsed.th === 'string' ? parsed.th : 'midnight',
      };
    }
    return null;
  } catch (err) {
    console.warn('Unable to decode share URL:', err);
    return null;
  }
}

/**
 * Checks if the current design relies on local uploaded images (blob URLs)
 * which cannot be shared via a stateless URL.
 */
export function hasLocalUploadedImages(
  uploadedAssets: UploadedAsset[] = [],
  userImage: string | null = null,
  code: string = ''
): boolean {
  if (uploadedAssets.length > 0) return true;
  if (userImage !== null && userImage.length > 0) return true;
  if (code.includes('blob:')) return true;
  return false;
}
