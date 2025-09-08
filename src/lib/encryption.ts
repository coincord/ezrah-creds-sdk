import { ed25519 } from '@noble/curves/ed25519';
import { x25519 } from '@noble/curves/ed25519';
import { bytesToHex } from '@noble/curves/utils';
import { bytesToBase64 } from './utils';

/**
 * Converts Ed25519 public key to X25519 public key for ECDH
 */
export function ed25519ToX25519PublicKey(ed25519PublicKey: Uint8Array): Uint8Array {
  return x25519.getPublicKey(ed25519PublicKey);
}

/**
 * Converts Ed25519 private key to X25519 private key for ECDH
 */
export function ed25519ToX25519PrivateKey(ed25519PrivateKey: Uint8Array): Uint8Array {
  return ed25519PrivateKey.slice(0, 32); // X25519 uses first 32 bytes
}

export async function wrapDEKForRecipients(
  dekPrivateKey: Uint8Array,
  recipientEd25519PublicKeys: Uint8Array[],
): Promise<WrappedDeks> {
  const wrappedDEKs: WrappedDeks = {};
  // Convert DEK private key to hex for encryption
  const dekPrivateKeyHex = bytesToHex(dekPrivateKey);
  for (let i = 0; i < recipientEd25519PublicKeys.length; i++) {
    const recipientId = `recipient_${i + 1}`;

    try {
      // Convert Ed25519 public key to X25519
      const x25519PublicKey = ed25519ToX25519PublicKey(recipientEd25519PublicKeys[i]);
      // Wrap DEK using X25519 ECDH + AES-GCM
      const wrappedDEK = await encryptWithX25519(dekPrivateKeyHex, x25519PublicKey);
      wrappedDEKs[recipientId] = wrappedDEK;
    } catch (error) {
      console.error(`❌ Failed to wrap DEK for ${recipientId}:`, error);
    }
  }

  return wrappedDEKs;
}

/**
 * Encrypts data using X25519 ECDH + AES-GCM
 */
async function encryptWithX25519(
  dataToEncrypt: string,
  receiverX25519PublicKey: Uint8Array,
  ephemeralPair?: {
    pub: Uint8Array;
    pk: Uint8Array;
  },
): Promise<WrappedDek> {
  // Generate ephemeral X25519 key pair for ECDH
  let pubkey = null,
    privKey = null;
  if (!ephemeralPair) {
    const x25519Pair = x25519.keygen();
    privKey = x25519Pair.secretKey;
    pubkey = x25519Pair.publicKey;
  } else {
    (pubkey = ephemeralPair.pub), (privKey = ephemeralPair.pk);
  }

  // Perform ECDH to get shared secret
  const sharedSecret = x25519.getSharedSecret(privKey, receiverX25519PublicKey);

  // Use shared secret as AES key (first 32 bytes)
  const aesKey = await crypto.subtle.importKey(
    'raw',
    sharedSecret.slice(0, 32),
    { name: 'AES-GCM' },
    false,
    ['encrypt'],
  );

  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt the data
  const data = new TextEncoder().encode(dataToEncrypt);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, data);

  return {
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
    iv: bytesToBase64(iv),
    ephemeralPublickKey: bytesToHex(pubkey),
    recipient_pub_key: bytesToHex(receiverX25519PublicKey),
    alg: 'X25519-AES-GCM',
    enc: 'AES-GCM',
  };
}

/**
 * Decrypts data using X25519 ECDH + AES-GCM
 */
async function decryptWithX25519(
  wrappedData: WrappedDek,
  receiverX25519PrivateKey: Uint8Array,
): Promise<string> {
  // Parse ephemeral public key
  const ephemeralPublicKey = new Uint8Array(
    wrappedData.ephemeralPublickKey.match(/.{2}/g)!.map((byte) => parseInt(byte, 16)),
  );

  // Perform ECDH to get shared secret
  const sharedSecret = x25519.getSharedSecret(receiverX25519PrivateKey, ephemeralPublicKey);

  // Import shared secret as AES key
  const aesKey = await crypto.subtle.importKey(
    'raw',
    sharedSecret.slice(0, 32),
    { name: 'AES-GCM' },
    false,
    ['decrypt'],
  );

  // Decode IV and ciphertext
  const iv = Uint8Array.from(atob(wrappedData.iv), (c) => c.charCodeAt(0));
  const ciphertext = Uint8Array.from(atob(wrappedData.ciphertext), (c) => c.charCodeAt(0));

  // Decrypt
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, aesKey, ciphertext);

  return new TextDecoder().decode(decrypted);
}

export async function dekPair() {
  return ed25519.keygen();
}

export async function encryptRSAData(
  dataToEncrypt: string,
  receiverRsaPublicKeyPem: string, // the receiver's RSA public key in PEM
): Promise<EncPayload> {
  // Generate a random symmetric key (shared secret)
  const symmetricKey = crypto.getRandomValues(new Uint8Array(32));

  // Import receiver's RSA public key
  const receiverPublicKey = await crypto.subtle.importKey(
    'spki',
    pemToArrayBuffer(receiverRsaPublicKeyPem),
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['encrypt'],
  );

  // Encrypt symmetric key with RSA
  const encryptedSymKey = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    receiverPublicKey,
    symmetricKey,
  );

  // Generate random IV for AES-GCM
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Import the symmetric key for AES
  const aesKey = await crypto.subtle.importKey('raw', symmetricKey, { name: 'AES-GCM' }, false, [
    'encrypt',
  ]);

  // Encrypt the disclosures
  const data = new TextEncoder().encode(dataToEncrypt);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, data);

  // Return encrypted data + RSA-encrypted symmetric key
  return {
    ciphertext: Buffer.from(ciphertext).toString('base64'),
    iv: Buffer.from(iv).toString('base64'),
    encryptedSymmetricKey: Buffer.from(encryptedSymKey).toString('base64'),
    alg: 'RSA-OAEP-AES-GCM',
    enc: 'AES-GCM',
  };
}

export async function decryptRSAData(
  payload: {
    ciphertext: string;
    iv: string;
    encryptedSymmetricKey: string;
  },
  receiverRsaPrivateKeyPem: string, // RSA private key in PEM
) {
  // Import receiver's RSA private key
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(receiverRsaPrivateKeyPem),
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['decrypt'],
  );

  // Decrypt symmetric key
  const symmetricKey = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    Buffer.from(payload.encryptedSymmetricKey, 'base64'),
  );

  // Import the symmetric key into AES-GCM
  const aesKey = await crypto.subtle.importKey('raw', symmetricKey, { name: 'AES-GCM' }, false, [
    'decrypt',
  ]);

  // Decode IV and ciphertext
  const iv = Buffer.from(payload.iv, 'base64');
  const ciphertext = Buffer.from(payload.ciphertext, 'base64');

  // Decrypt the disclosures
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, aesKey, ciphertext);

  return new TextDecoder().decode(decrypted);
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const binary = atob(b64);
  const buf = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < binary.length; i++) {
    view[i] = binary.charCodeAt(i);
  }
  return buf;
}
