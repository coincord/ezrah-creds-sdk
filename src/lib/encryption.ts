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
