import { toString, fromString } from 'uint8arrays';

const u8a = { toString, fromString };

export function bytesToBase64url(b: Uint8Array): string {
  return u8a.toString(b, 'base64url');
}

export function base64ToBytes(s: string): Uint8Array {
  const inputBase64Url = s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return u8a.fromString(inputBase64Url, 'base64url');
}

/**
 * Encodes a Uint8Array to a base64 string representation with padding.
 * @param b - the byte array to convert
 *
 * @public
 */
export function bytesToBase64(b: Uint8Array): string {
  return u8a.toString(b, 'base64pad');
}

/**
 * Encodes the bytes of an input string to base64url
 * @param s - the original string
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export function encodeBase64url(s: string): string {
  return bytesToBase64url(u8a.fromString(s));
}

/**
 * Decodes a base64url string to a utf8 string represented by the same bytes.
 * @param s - the base64url string to be decoded
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export function decodeBase64url(s: string): string {
  return u8a.toString(base64ToBytes(s));
}

/**
 * Builds a string from a Uint8Array using the utf-8 encoding.
 * @param b - the array to be converted
 *
 * @public
 */
export function bytesToUtf8String(b: Uint8Array): string {
  return u8a.toString(b, 'utf-8');
}

/**
 * Encodes a string to a Uint8Array using the utf-8 encoding.
 * @param s - the string to be encoded
 *
 * @public
 */
export function stringToUtf8Bytes(s: string): Uint8Array {
  return u8a.fromString(s, 'utf-8');
}
