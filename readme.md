# Ezrah Creds SDK

This document provides a comprehensive overview of how to use the **Ezrah Creds SDK**, a TypeScript package that simplifies the creation, issuance, and verification of Verifiable Credentials (VCs). It also includes tools for managing Decentralized Identifiers (DIDs), webhook integrations, organization settings, and analytics — all designed to integrate seamlessly with Ezrah’s identity infrastructure.

---

## Installation

To start using the Ezrah Creds SDK, install it via npm or yarn. This will add the SDK to your project so you can begin issuing and verifying credentials and interacting with the Ezrah platform programmatically.

> Ezrah(Coincord) Libraries are hosted on github not npm so add this to your .npmrc file, (vim ~/.npmrc)

```sh
@coincord:registry=https://npm.pkg.github.com
```

With this set your environment will know to check github for coincord libraries instead of npm

```sh
# npm
npm install @coincord/ezrah-creds-sdk
```

or

```sh
# yarn
yarn install @coincord/ezrah-creds-sdk
```

## Getting Started

This section initializes the SDK. Import the main class and instantiate it to begin accessing all available methods. This object becomes your main entry point for issuing credentials, managing webhooks, and more.

```ts
import EzrahCredential from '@coincord/ezrah-creds-sdk';

const ezrah = new EzrahCredential();
```

---

## Credential Management

This section contains methods to issue Verifiable Credentials (VCs) to users. These credentials can contain any structured data and are tied to a DID. Use this to programmatically issue credentials for KYC, employment, certification, and more.

### Issue a Credential

Use this method when you already have a pre-defined credential template (claim ID) and want to issue a VC to a user identified by their DID.

```ts
const credential = await ezrah.issueCredential({
  claimID: 'template123',
  did: 'did:ezrah:abc123',
  claims: {
    name: 'John Doe',
    role: 'Admin',
  },
});
```

---

### Issue an Encrypted Credential

Issue via SD-JWT secure end to end encryption

#### 🔐 SD-JWT Secure End-to-End Encryption

SD-JWT (Selective Disclosure JSON Web Token) enables users to disclose only specific claims (pieces of data) to a relying party, while keeping the rest confidential. When combined with secure end-to-end encryption, this approach ensures that sensitive information is protected both at rest and in transit.

This implementation introduces secure encryption of the disclosures using ephemeral (one-time use) keys with the X25519 key exchange protocol and AES-256 encryption.

---

#### Encrypted Disclosures Structure

```json
{
  encrypted_disclosures: {
            ciphertext: 'gCxNC18f31VAoX6Mea4fh3sdI5wDOfKUuEC9CHuVEzEcmOFY1XVPX5u21Vft2...',
            iv: 'JyZ08NSSqrbLHVCt',
            ephemeralPubKey: 'LZQFwtDa0eSLkpPKjKpyVYlDrMcFMYN7kPdCENhefw0',
            enc: 'AES-GCM',
            alg: 'X25519-AES-GCM'
          }
        }
}

```

### 🔒 How It Works

#### 1. **Claim Hashing and Disclosure Generation**

- Before encryption, each **claim** (e.g., name, birthdate, etc.) is **hashed** to generate its disclosure representation.
- These hashed claims are selectively shared only when the user permits it.

#### 2. **Ephemeral Key Exchange with X25519**

- A fresh **ephemeral key pair** is generated for each encryption session using **X25519**, a Diffie-Hellman key exchange over Curve25519.
- These keys are **one-time use only**, providing **forward secrecy** and preventing reuse-based attacks.
- The **receiver’s public key** (e.g., device or backup key) is used to derive a shared secret via X25519.

#### 3. **Encryption using AES-256**

- The shared secret derived from X25519 is used as the **symmetric key** for encrypting the disclosure payload.
- AES-256 in **GCM or CBC mode** (implementation-specific) is used for the encryption.
- A **nonce** (or IV) ensures randomness for each encryption, preventing identical cipher outputs.

---

### 🔑 Ephemeral Key Usage

| Key          | Description                                           | Purpose                                             |
| ------------ | ----------------------------------------------------- | --------------------------------------------------- |
| `device_key` | Ephemeral public key derived for the current device   | Used to decrypt disclosures on the current device   |
| `back_up`    | Ephemeral key for user’s backup or recovery mechanism | Enables access during recovery or multi-device sync |

- These keys are included **encrypted** and can be safely sent over the network.
- Only the holder of the corresponding **private keys** can derive the shared secret and decrypt the disclosures.

---

### ✅ Benefits

- **Selective Disclosure**: Users share only what’s needed.
- **End-to-End Encrypted**: Even intermediaries can’t read the claims.
- **Forward Secrecy**: Ephemeral keys ensure past sessions remain secure.
- **Recovery Friendly**: The `back_up` key allows for secure restoration of encrypted data.

---

#### Step 1: Define Credential Claims

```ts
const claims = {
  sub: 'subject_string_here',
  kyc_provider: 'DOJAH',
  passport_id: '2347BV98FB',
  expiry_date: new Date('10-10-2027').toISOString(),
  issuanceDate: new Date().toISOString(),
  first_name: 'Nelson',
  last_name: 'Obioma',
  issuer: { id: 'issuer string here' },
};

const disclosureFrame: Array<string> = [
  'passport_id',
  'expiry_date',
  'first_name',
  'last_name',
  'issuer',
];
```

---

### Step 2: Issue Encrypted SD-JWT Credential

```ts
const endUserPublicKey = 'HexadecimalEncodedEndUserPublickKey';

const result = await ezrahCredsSDK.issueEncryptedSDJWT({
  claims,
  disclosureFrame,
  endUserEd25519HexPuk: endUserPublicKey,
});
```

---

##### Result: Issued Credential

```json
{
  "credential": "<jwt_string_here>"
}
```

This is a signed and encrypted JWT that contains secure disclosures.

---

### Decoded JWT Structure

```json
{
  "jwt": {
    "header": {
      "typ": "dc+sd-jwt",
      "kid": "<key_id>",
      "alg": "ES256K"
    },
    "payload": {
      "iss": "did:ezrah:<issuer_did>",
      "vct": "https://credentials.example.com/identity_credential",
      "kyc_provider": "DOJAH",
      "issuanceDate": "2025-05-15T14:23:41.174Z",
      "_sd": ["...hashes"],
      "_sd_alg": "sha-256"
    },
    "signature": "<signature_string>"
  },
  "encrypted_disclosures": {
    "ciphertext": "...",
    "iv": "...",
    "ephemeralPublicKey": "..."
  },
  "metadata": {
    "_hash_alg": "sha256",
    "sd_count": 5,
    "enc": "AES-GCM",
    "key_agreement": "X25519"
  }
}
```

---

##### Decrypted Disclosure Structure

Disclosures are decrypted on the client device.

```json
"disclosures": [
  {
    "key": "passport_id",
    "value": "2347BV98FB",
    "salt": "...",
    "_digest": "...",
    "_encoded": "..."
  },
  {
    "key": "expiry_date",
    "value": "2027-10-09T23:00:00.000Z"
  },
  {
    "key": "first_name",
    "value": "Nelson"
  },
  {
    "key": "last_name",
    "value": "Obioma"
  },
  {
    "key": "issuer",
    "value": { "id": "did:ezrah:<issuer_did>" }
  }
]
```

---

#### Behind the Scenes: Preprocessing

Before sending the request, the SDK:

- Hashes selected claims using `sha256`
- Encrypts disclosures using `X25519 + AES-GCM`
- Packs claims into `_sd`

##### Example of Preprocessed Structure

```json
{
  "_hash_alg": "sha256",
  "packedClaims": {
    "sub": "subject_string_here",
    "kyc_provider": "DOJAH",
    "issuanceDate": "2025-05-15T14:23:41.207Z",
    "_sd": ["<hashed_disclosure_1>", "<hashed_disclosure_2>", ...]
  },
  "disclosures": [
    {
      "key": "passport_id",
      "value": "2347BV98FB",
      "salt": "...",
      "_digest": "...",
      "_encoded": "..."
    },
    ...
  ]
}
```

---

##### Final Credential Creation API Request

```json
{
  "subject": "did:ethr:0x1234...abcd",
  "issuer": "did:ethr:0xissuer1234...def0",
  "type": ["VerifiableCredential", "KYCVerifiedCredential"],
  "issuanceDate": "2025-05-15T13:12:34.468Z",
  "expirationDate": "2027-10-09T23:00:00.000Z"
}
```

---

#### Summary

The EzrahCredsSDK simplifies the issuance of secure, privacy-preserving SD-JWT credentials by handling:

- Claim hashing
- Selective disclosure
- Client-side encryption

All while producing verifiable and tamper-proof credentials ready for use in decentralized identity systems.

---

### Create A Credential Template

Use this method when you want to create a new template structure for your credentials.

```ts
const template = await ezrah.createTemplateStructure({
  claims: 'firstname, lastname, birthcert, reference_code',
  description: 'template example',
  title: 'Example Template Structure',
});
```

### Issue via SDK Shortcut

A simplified wrapper to issue credentials using just the basic details (title, claim ID, and fields). Ideal for quick issuance flows or UI-based forms.

```ts
const credential = await ezrah.issuePreClaimed({
  title: 'Employee Badge',
  template_claim_id: 'template123',
  claims: {
    name: 'Jane Smith',
    department: 'Engineering',
  },
});
```

---

## Credential Verification

This section allows you to define models for verifying specific credentials. You can specify what claims to match, whether verification is manual, and then fetch all requests associated with those models. This is useful for onboarding, compliance, and access-control use cases.

### Create a Verification Model

Use this method to define the conditions under which a credential should be considered valid. This can include issuer checks, field matching, and whether the request requires human review.

```ts
const model = await ezrah.createVerificationModel({
  title: 'Employee Verification',
  purpose: 'Verify employee credentials',
  claims_match: { department: 'Engineering' },
  isser_match: 'issuer123',
  manual_verification: false,
});
```

### Fetch Verification Models

Retrieves a list of verification models you’ve defined. Helpful for displaying available verification flows in your dashboard or admin interface.

```ts
const models = await ezrah.verifcationModel();
```

### Get Verification Requests

Returns all credential verification requests submitted to a specific verification model. You can use this to build review dashboards or trigger workflows based on verification outcomes.

```ts
const requests = await ezrah.verifcationRequests('model123');
```

---

## DID and Templates

This section handles the discovery and templating side of the system. You can resolve DIDs to get metadata and structure your credential issuance using reusable templates.

### Resolve a DID

Resolves a DID (Decentralized Identifier) and returns associated metadata. Useful for displaying user info or validating an identity before issuing or verifying credentials.

```ts
const didInfo = await ezrah.resolveDID('did:ezrah:abc123');
```

### Fetch Templates

Retrieves a list of credential templates available for use in issuance. Templates help standardize the data structures you issue, making it easier to automate workflows and comply with schema requirements.

```ts
const templates = await ezrah.templates();
```

---

## Credential Analytics

Use this section to track issued credentials and gather insight into how credentials are being used. You can fetch lists of credentials and get usage stats across different timelines or templates.

### Get Issued Credentials

Lists all credentials issued under your organization, optionally filtered by timeline, status, or template. Useful for analytics dashboards and credential audits.

```ts
const credentials = await ezrah.issuedCredentials({
  cursor: null,
  take: 10,
  timeline: 'lastMonth',
  status: 'issued',
  template_id: 'template123',
});
```

### Fetch Credential Analytics

Provides an overview of credential-related statistics, such as issuance counts and trends. Ideal for tracking adoption and performance of your identity programs.

```ts
const analytics = await ezrah.credentialAnalytics();
```

---

## Webhook Management

This section lets you set up webhooks to listen for events like credential issuance or verification results. Great for real-time integrations with your backend or third-party systems.

### Add a Credential Webhook

Registers a new webhook to be triggered when a specific request key is processed. Webhooks enable you to respond automatically to issuance or verification events.

```ts
const webhook = await ezrah.addCredentialsWebhook({
  request_key: 'req123',
  name: 'Credential Issued Webhook',
  webhook_url: 'https://example.com/webhook',
});
```

### Update a Webhook

Edits an existing webhook configuration, such as changing the endpoint URL or display name.

```ts
const updatedWebhook = await ezrah.updateCredentialWebhook({
  webhook_id: 'webhook123',
  request_key: 'req123',
  name: 'Updated Webhook',
  webhook_url: 'https://example.com/updated-webhook',
});
```

### Delete a Webhook

Deletes a webhook by its ID. Use this to clean up old integrations or disable inactive endpoints.

```ts
const result = await ezrah.deleteCredentialWebhook('webhook123');
```

### List Webhooks

Retrieves all currently registered webhooks. Useful for building settings pages or debugging integrations.

```ts
const webhooks = await ezrah.webhooks();
```

---

## Organization Management

Manage your organization settings such as general metadata and branding. These APIs help ensure your credentials are visually aligned with your brand and that team access is correctly configured.

### Get Organization Info

Returns information about the current organization using the SDK. This includes your organization's name, branding, and configuration details.

```ts
const orgDetails = await ezrah.organization();
```

### Upload Organization Logo

Uploads a logo that will appear on credentials and in verification UIs. This adds branding and trust to the experience.

```ts
const logoUrl = await ezrah.uploadOrganizationLogo(file);
```

---

## Error Handling

To ensure your integration is resilient, wrap all SDK methods in try/catch blocks. This helps you gracefully handle network issues, misconfigurations, or invalid inputs.

```ts
try {
  const response = await ezrah.templates();
} catch (error) {
  console.error('Something went wrong:', error);
}
```

---

## Notes

- Fully written in TypeScript with complete type definitions.
- Designed to work hand-in-hand with the Ezrah GraphQL Playground for advanced operations.
- For security, always store your API keys using environment variables or a secure vault.
