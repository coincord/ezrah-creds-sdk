import { gql } from 'graphql-request';

// ISSUED § CREDENTIALS
export const ISSUEDCREDENTIALS = gql`
  query IssuedCredentials(
    $timeline: String
    $status: [String]
    $template_id: String
    $take: Int
    $cursor: String
  ) {
    issued_credentials(
      filter: { timeline: $timeline, option: { status: $status, template_id: $template_id } }
      take: $take
      cursor: $cursor
    ) {
      total_count
      credentials {
        id
        claims
        status
        credential_template_id
        credential_template {
          title
          id
        }
        holder
        created_at
      }
      size
    }
  }
`;

export const CREDENTIALANALYTICS = gql`
  query CredsAnalytics {
    credentials_analytics {
      ISSUED
      CLAIMED
      REVOKED
      EXPIRED
    }
  }
`;

export const RESOLVEDID = gql`
  query ResolveDID($did: String!) {
    resolveDid(did: $did) {
      did
      resolvedDID
    }
  }
`;

// TEMPLATES
export const TEMPLATES = gql`
  query Templates {
    templates {
      id
      title
      claimStructure
      description
      created_at
    }
  }
`;

export const SUB_ISSUER_LIST = gql`
  query SUBIssuer {
    sub_issuers {
      did
      name
    }
  }
`;

// VERIFICATION MODELS
export const VERIFICATIONMODELS = gql`
  query VerificationModel {
    verifications_models {
      id
      title
      verification_title
      purpose
      verification_link
      manual_verification
      issuer_match
      claims_match
      created_at
    }
  }
`;

// VERIFICATION REQUESTS
export const VERIFICATIONREQUESTS = gql`
  query VerificationRequests($verification_model: String!) {
    verification_requests(verification_model: $verification_model) {
      id
      status
      created_at
      presentation
      issuer_match
      claims_match
    }
  }
`;

// ORGANIZATION
export const ORGANIZATION = gql`
  query Organization {
    organization {
      id
      name
      domain
      alias
      logo
      identifier {
        did
      }
    }
  }
`;

// CREDENTIAL WEBHOOK
export const CREDENTIALWEBHOOKS = gql`
  query CredentialWebhooks {
    credential_webhooks {
      id
      name
      webhook_url
    }
  }
`;
