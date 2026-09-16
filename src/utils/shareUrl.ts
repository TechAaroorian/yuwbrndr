import type { UploadedAsset } from '../types/studio';

const COMPRESSED_PREFIX = 'v1z.';
const UNCOMPRESSED_PREFIX = 'v1u.';
const MAX_ENCODED_LENGTH = 32_000;
const MAX_DECODED_BYTES = 256 * 1024;
const MAX_CODE_LENGTH = 200_000;

export const MAX_SHARE_URL_LENGTH = 32_768;

export class ShareUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShareUrlError';
  }
}

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
  if (!/^[A-Za-z0-9_-]+$/.test(base64) || base64.length > MAX_ENCODED_LENGTH) {
    throw new ShareUrlError('The shared link is invalid or too large.');
  }

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

async function readStreamWithLimit(
  stream: ReadableStream<Uint8Array>,
  maxBytes: number
): Promise<Uint8Array> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw new ShareUrlError('The shared design is too large to load safely.');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const output = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}

function encodeBytes(bytes: Uint8Array, prefix: string): string {
  const encoded = `${prefix}${bytesToUrlSafeBase64(bytes)}`;
  if (encoded.length > MAX_ENCODED_LENGTH) {
    throw new ShareUrlError('This design is too large to share as a URL.');
  }
  return encoded;
}

/**
 * Compresses and encodes SharePayload into a URL-safe string.
 * Uses native browser CompressionStream with zero external libraries.
 */
export async function encodeShareUrl(payload: SharePayload): Promise<string> {
  if (payload.c.length > MAX_CODE_LENGTH) {
    throw new ShareUrlError('This design is too large to share as a URL.');
  }

  const json = JSON.stringify(payload);
  const jsonBytes = new TextEncoder().encode(json);
  if (jsonBytes.byteLength > MAX_DECODED_BYTES) {
    throw new ShareUrlError('This design is too large to share as a URL.');
  }

  if (typeof CompressionStream !== 'undefined') {
    try {
      const stream = new Blob([jsonBytes as unknown as BlobPart])
        .stream()
        .pipeThrough(new CompressionStream('deflate-raw'));
      const compressed = await readStreamWithLimit(stream, MAX_ENCODED_LENGTH);
      return encodeBytes(compressed, COMPRESSED_PREFIX);
    } catch (error) {
      if (error instanceof ShareUrlError) throw error;
      // Some browsers expose CompressionStream without supporting deflate-raw.
    }
  }

  return encodeBytes(jsonBytes, UNCOMPRESSED_PREFIX);
}

/**
 * Decodes and decompresses a URL hash string back into a SharePayload.
 */
export async function decodeShareUrl(hashString: string): Promise<SharePayload> {
  const params = new URLSearchParams(hashString.replace(/^#/, ''));
  const rawValue = params.get('share');
  if (!rawValue) throw new ShareUrlError('The shared link is missing its design data.');

  const isCompressed = rawValue.startsWith(COMPRESSED_PREFIX);
  const isUncompressed = rawValue.startsWith(UNCOMPRESSED_PREFIX);
  const isLegacy = !isCompressed && !isUncompressed;
  const encoded = isLegacy ? rawValue : rawValue.slice(4);
  const bytes = urlSafeBase64ToBytes(encoded);

  let jsonBytes: Uint8Array;
  if (isCompressed || isLegacy) {
    if (typeof DecompressionStream === 'undefined') {
      if (!isLegacy) {
        throw new ShareUrlError('This browser cannot open compressed share links.');
      }
      jsonBytes = bytes;
    } else {
      try {
        const stream = new Blob([bytes as unknown as BlobPart])
          .stream()
          .pipeThrough(new DecompressionStream('deflate-raw'));
        jsonBytes = await readStreamWithLimit(stream, MAX_DECODED_BYTES);
      } catch (error) {
        if (!isLegacy || error instanceof ShareUrlError) throw error;
        jsonBytes = bytes;
      }
    }
  } else {
    jsonBytes = bytes;
  }

  if (jsonBytes.byteLength > MAX_DECODED_BYTES) {
    throw new ShareUrlError('The shared design is too large to load safely.');
  }

  try {
    const json = new TextDecoder('utf-8', { fatal: true }).decode(jsonBytes);

    const parsed = JSON.parse(json);
    if (
      parsed &&
      typeof parsed.c === 'string' &&
      (parsed.t === 'html' || parsed.t === 'canvas')
    ) {
      if (parsed.c.length > MAX_CODE_LENGTH) {
        throw new ShareUrlError('The shared design is too large to load safely.');
      }
      return {
        t: parsed.t,
        c: parsed.c,
        p: typeof parsed.p === 'string' ? parsed.p : 'twitter-post',
        th: typeof parsed.th === 'string' ? parsed.th : 'midnight',
      };
    }
    throw new ShareUrlError('The shared link contains unsupported design data.');
  } catch (error) {
    if (error instanceof ShareUrlError) throw error;
    throw new ShareUrlError('The shared link is invalid or corrupted.');
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
