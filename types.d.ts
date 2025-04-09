declare global {
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

  interface CreateCredentialSDKResponse {
    url: string;
    pending_id: string;
  }


  interface Templates {
    id: string;
    title: string;
    claimStructure: string;
    description: string;
    created_at: string;
  }

  interface ResolvedDID {
    did: string;
    resolvedDID: string;
  }

  interface CreateVerificationModel {
    title: string;
    purpose: string;
    claims_match: string;
    issuer_match: string;
    manual_verification: boolean;
  }

  interface CreateVerificationModelResponse {
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

  interface CreateCredentialsWebhook {
    request_key: string;
    name: string;
    webhook_url: string;
  }

  interface CreateCredentialsWebhookResponse {
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

  interface AddOrganizationApiKeyResponse {
    id: string;
    title: string;
    api_key: string;
    created_at: string;
  }
}


export default {}