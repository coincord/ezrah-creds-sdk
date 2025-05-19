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

export const CREATETEMPLATESTRUCTURE = gql`
  mutation CreateTemplateStructure($claims: String!, $description: String!, $title: String!) {
    createCredentialTemplateStructure(claims: $claims, description: $description, title: $title) {
      id
      title
      claimStructure
      created_at
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

// WEBHOOKs
export const ADDCREDENTIALSWEBHOOK = gql`
  mutation AddCredentialsWebhook($request_key: String!, $name: String!, $webhook_url: String!) {
    addCredentialsWebhook(request_key: $request_key, name: $name, webhook_url: $webhook_url) {
      id
      name
      webhook_url
    }
  }
`;

export const UPDATECREDENTIALWEBHOOK = gql`
  mutation UpdateCredentialWebhook(
    $webhook_id: String!
    $request_key: String!
    $name: String!
    $webhook_url: String!
  ) {
    updateCredentialWebhook(
      webhook_id: $webhook_id
      request_key: $request_key
      name: $name
      webhook_url: $webhook_url
    ) {
      id
      name
      webhook_url
    }
  }
`;

export const DELETECREDENTIALWEBHOOK = gql`
  mutation DeleteCrdentialWebhook($webhook_id: String!) {
    deleteCredentialWebhook(webhook_id: $webhook_id)
  }
`;

export const CREATE_ENCRYPTED_SDJWT_CREDENTIAL = gql`
  mutation createEncryptedSdjwtCredential($packedRequest: JSON) {
    createEncryptedSdjwtCredential(packedRequest: $packedRequest) {
      _encoded
      credential
    }
  }
`;
