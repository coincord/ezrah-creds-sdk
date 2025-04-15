# Ezrah Creds SDK

This document provides a comprehensive overview of how to use the **Ezrah Creds SDK**, a TypeScript package that simplifies the creation, issuance, and verification of Verifiable Credentials (VCs). It also includes tools for managing Decentralized Identifiers (DIDs), webhook integrations, organization settings, and analytics — all designed to integrate seamlessly with Ezrah’s identity infrastructure.

---

## Installation

To start using the Ezrah Creds SDK, install it via npm or yarn. This will add the SDK to your project so you can begin issuing and verifying credentials and interacting with the Ezrah platform programmatically.

```bash
npm install ezrah-creds-sdk
# or
yarn add ezrah-creds-sdk
```

---

## Getting Started

This section initializes the SDK. Import the main class and instantiate it to begin accessing all available methods. This object becomes your main entry point for issuing credentials, managing webhooks, and more.

```ts
import EzrahCredential from 'ezrah-creds-sdk';

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
