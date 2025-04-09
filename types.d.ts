declare global {

  // CREDENTIALS
  interface CreateCredential {
    claimID: string;
    did: string;
    claims: string;
  }

  interface VCredential{
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
      id: string
    }
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
    issued_credentials:{
      total_count: number;
      size: number;
      credentials: Credentials[]
    }
  }

  interface CreateCredentialSDK {
    title: string;
    template_claim_id: string;
    claims: JSON;
  }

  interface CredentialSDKResponse {
    url: string;
    pending_id: string;
  }

  interface CredentialAnalytics {
    credentials_analytics: {
      ISSUED: number;
      CLAIMED: number;
      REVOKED: number;
      EXPIRED: number;
    };
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
    resolvedDID: string;
  }

  // VERIFICATION MODELS & REQUESTS

  interface CreateVerificationModel {
    title: string;
    purpose: string;
    claims_match: string;
    issuer_match: string;
    manual_verification: boolean;
  }

  interface VerificationModelResponse {
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

  interface VerificationModelListing {
    verifications_models: VerificationModelResponse[];
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

  interface CredentialsWebhookResponse {
    id: string
    name: string
    request_key: string
    webhook_url: string
    last_used: string
    created_at: string
  }

  interface UpdateCredentialWebhook {
    webhook_id: string;
    request_key: string;
    name: string;
    webhook_url: string;
  }

  interface UpdateCredentialWebhookResponse {
    id: string
    name: string
    webhook_url: string
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
    organizationApiKey: OrganizationApiKeyResponse[];
  }

  interface Organization {
    id: string;
    name: string;
    domain: string;
    alias: string;
    logo: string;
    identifier: Identifier;
    api_key: string;
    api_keys: OrganizationApiKey[];
  }

  interface OrganizationDetails {
    organization: Organization;
  }
}


export default {}