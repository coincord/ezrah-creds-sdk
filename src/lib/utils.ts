import { ed25519 } from '@noble/curves/ed25519.js';
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
 * Converts Ed25519 public keys to X25519
 * @param publicKey - The bytes of an Ed25519P public key
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export function convertEd25519PublicKeyToX25519(publicKey: Uint8Array): Uint8Array {
  return ed25519.utils.toMontgomery(publicKey);
}

/**
 * Converts Ed25519 private keys to X25519
 * @param privateKey - The bytes of an Ed25519P private key
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export function convertEd25519PrivateKeyToX25519(privateKey: Uint8Array): Uint8Array {
  return ed25519.utils.toMontgomerySecret(privateKey);
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

export function bytesToHex(b: Uint8Array): string {
  return u8a.toString(b, 'base16');
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
