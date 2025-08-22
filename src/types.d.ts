declare global {
  type PolicyStateEnum = 'REVOKE' | 'SUSPEND' | 'EXPIRY';

  // CREDENTIALS
  interface Identifier {
    id: string;
    did: string;
    created_at: string | Date;
  }

  interface CreateCredential {
    claimID: string;
    did: string;
    claims: string;
  }

  interface PolicyUpdateCredentialParams {
    credential_urn: string;
    action: PolicyStateEnum;
    state: boolean;
  }

  interface VCredential {
    proof: string;
    proof_type: string;
    credential: string;
  }

  interface Credentials {
    id: string;
    claims: string;
    title: string;
    status: string;
    credential_template_id: string;
    credential_template: {
      title: string;
      id: string;
    };
    holder: string;
    created_at: string;
  }

  interface IssuedCredentials {
    timeline?: string;
    status?: string[];
    template_id?: string;
    take?: number;
    cursor?: string;
  }

  interface IssuedCredentialsResponse {
    total_count: number;
    size: number;
    credentials: Credentials[];
  }

  interface CreateCredentialSDK {
    title: string;
    template_claim_id: string;
    claims: Record<string, string>;
  }

  interface CreateTemplateStructure {
    claims: string;
    description: string;
    title: string;
  }

  interface CredentialSDKResponse {
    url: string;
    pending_id: string;
  }

  interface CredentialAnalytics {
    ISSUED: number;
    CLAIMED: number;
    REVOKED: number;
    EXPIRED: number;
  }

  // TEMPLATEs
  interface Templates {
    id: string;
    title: string;
    claimStructure: string;
    description: string;
    created_at: string;
  }

  interface TemplateListing {
    templates: Templates[];
  }

  interface ResolvedDID {
    did: string;
    resolvedDID: Record<string, string>;
  }

  // VERIFICATION MODELS & REQUESTS

  interface CreateVerificationModel {
    title: string;
    purpose: string;
    claims_match: string;
    issuer_match: string;
    manual_verification: boolean;
  }

  interface AuthVerificationModel {
    title: string;
    purpose: string;
    claims_match: string;
    issuer_match: string;
    manual_verification: boolean;
    client_id: string;
    client_secret: string;
    callback: string | null;
    custom_url_scheme: null | string;
    oob_prefix: string;
    session_duration: string;
  }

  interface CreateAuthVerificationModel extends CreateVerificationModel {
    client_id: string;
    client_secret: string;
    callback?: string;
    custom_url_scheme?: string;
    oob_prefix?: string;
    session_duration: string;
  }

  interface VerificationModel {
    id: string;
    title: string;
    purpose: string;
    verification_link: string;
    manual_verification: boolean;
    issuer_match: string;
    claims_match: string;
    verification_title: string;
    created_at: string;
  }

  interface AuthVerificationModel {
    id: string;
    title: string;
    purpose: string;
    verification_link: string;
    manual_verification: boolean;
    issuer_match: string;
    claims_match: string;
    verification_title: string;
    created_at: string;
    client_id: string;
    client_secret: string;
  }

  export interface CreateVerificationModelRes {
    createVerificationModel: VerificationModel;
  }

  interface VerificationModelListing {
    verifications_models: VerificationModel[];
  }

  interface VerificationRequest {
    id: string;
    status: string;
    presentation: string;
    issuer_match: string;
    claims_match: string;
  }

  interface VerificationRequestListing {
    verification_requests: VerificationRequest[];
  }

  // WEBOOKS

  interface CreateCredentialsWebhook {
    request_key: string;
    name: string;
    webhook_url: string;
  }

  interface CreateRequestMediatorMessage {
    oob_code?: string;
    source?: string;
    session_code?: string;
    message: string;
    reciever_did: string;
  }

  interface CredentialsWebhookResponse {
    id: string;
    name: string;
    request_key: string;
    webhook_url: string;
    last_used: string;
    created_at: string;
  }

  export interface CredentialWebHook {
    id: string;
    name: string;
    webhook_url: string;
  }

  export interface CredentialWebhookListings {
    credential_webhooks: CredentialWebHook[];
  }

  interface UpdateCredentialWebhook {
    webhook_id: string;
    request_key: string;
    name: string;
    webhook_url: string;
  }

  interface UpdateCredentialWebhookResponse {
    id: string;
    name: string;
    webhook_url: string;
  }

  interface AddOrganizationApiKey {
    title: string;
  }

  interface OrganizationApiKeyResponse {
    id: string;
    title: string;
    api_key: string;
    created_at: string;
  }

  interface OrganizationApiKeyListing {
    id: string;
    title: string;
    api_key: string;
    created_at: string;
  }

  interface Organization {
    id: string;
    name: string;
    domain: string;
    alias: string;
    logo: string;
    identifier: Identifier;
    api_key: string;
    api_keys: OrganizationApiKeyResponse[];
  }

  interface OrganizationDetails {
    organization: Organization;
  }

  interface PackedRequest {
    _hash_alg: 'sha256' | 'sha512';
    packedClaims: {
      sub: string;
      issuanceDate: string;
      _sd: string[];
      [key: string]: unknown;
    };
    encrypted_disclosures: EncryptedDisclosures;
  }

  interface EncryptedSdjwtResponse {
    _encoded: string;
    urn?: string;
    credential: {
      [key: string]: unknown;
    };
  }
}

export default {};
