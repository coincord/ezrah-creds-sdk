import { gql } from 'graphql-request';

// CRENDENTIALS
export const CREATECREDENTIALS = gql`
  mutation CreateCredential($claimID: String!, $did: String!, $claims: String!) {
    createCredential(claimID: $claimID, did: $did, claims: $claims) {
      proof
      proof_type
      credential
    }
  }
`;

export const CREATECREDENTIALSDK = gql`
  mutation CreateCredentialSDK($title: String!, $template_claim_id: String!, $claims: JSON!) {
    createCredentialSDK(title: $title, template_claim_id: $template_claim_id, claims: $claims) {
      url
      pending_id
    }
  }
`;

// VERIFICATION MODELS
export const CREATEVERIFICATIONMODEL = gql`
  mutation CreateVerificationModel(
    $title: String!
    $purpose: String!
    $claims_match: String!
    $isser_match: String!
    $manual_verification: Boolean!
  ) {
    createVerificationModel(
      title: $title
      purpose: $purpose
      claims_match: $claims_match
      isser_match: $isser_match
      manual_verification: $manual_verification
    ) {
      id
      title
      purpose
      claims_match
      issuer_match
      manual_verification
      verification_link
      verification_title
      created_at
    }
  }
`;
