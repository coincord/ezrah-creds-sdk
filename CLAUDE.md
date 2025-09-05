# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

The following commands are available via npm scripts:

- `npm run build` - Compiles TypeScript to JavaScript in the `dist` folder
- `npm test` - Runs Jest tests using experimental VM modules for ESM support
- `npm run lint` - Runs ESLint on TypeScript files in the `src` directory
- `npm run lint:fix` - Runs ESLint with auto-fixing enabled
- `npm run format` - Formats code using Prettier for TypeScript, JSON, and Markdown files

To run a single test file:
```bash
npm test -- path/to/test.spec.ts
```

## Architecture Overview

This is the **Ezrah Credentials SDK** - a TypeScript SDK for managing Verifiable Credentials (VCs) and Decentralized Identifiers (DIDs) that integrates with Ezrah's identity infrastructure.

### Core Structure

- **Main Entry Point**: `src/lib/index.ts` - Contains the `EzrahCredential` class that serves as the primary SDK interface
- **GraphQL Integration**: Uses `graphql-request` for API communication with the Ezrah platform
- **Modular Organization**: 
  - `src/lib/query.ts` - GraphQL query definitions
  - `src/lib/mutation.ts` - GraphQL mutation definitions  
  - `src/lib/requester.ts` - GraphQL client configuration
  - `src/lib/encryption.ts` - RSA encryption/decryption utilities
  - `src/lib/utils.ts` - Helper utilities including Base64URL decoding
- **Type Definitions**: `src/types.d.ts` - TypeScript type definitions

### Key Features

1. **SD-JWT Support**: Implements Selective Disclosure JWT with end-to-end encryption using X25519 + AES-256
2. **Credential Management**: Issue, verify, and manage verifiable credentials
3. **DID Resolution**: Resolve Decentralized Identifiers and fetch metadata
4. **Webhook Integration**: Manage webhooks for real-time event notifications
5. **Template System**: Create and manage credential templates
6. **Analytics**: Track credential issuance and usage statistics

### Dependencies

- **Core**: GraphQL client, Noble cryptography libraries, SD-JWT helper
- **Dev**: TypeScript, Jest, ESLint, Prettier
- **Package Distribution**: Published to GitHub Packages registry as `@coincord/ezrah-creds-sdk`

### Testing Configuration

- Uses Jest with TypeScript support and ESM modules
- Configured for Node.js environment
- Transform patterns handle ESM modules in node_modules

### Code Standards

- TypeScript with strict typing enabled
- ESLint with TypeScript rules
- Prettier for code formatting
- ESM module format (type: "module" in package.json)

## Important Notes

- This SDK requires authentication with the Ezrah platform (API keys via environment variables)
- The package is distributed via GitHub Packages, requiring `.npmrc` configuration:
  ```
  @coincord:registry=https://npm.pkg.github.com
  ```
- Supports both regular credentials and encrypted SD-JWT credentials for privacy-preserving use cases
- All GraphQL operations are wrapped with proper error handling and type safety