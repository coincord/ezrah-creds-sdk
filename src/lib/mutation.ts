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
    $issuer_match: String!
    $manual_verification: Boolean!
  ) {
    createVerificationModel(
      title: $title
      purpose: $purpose
      claims_match: $claims_match
      issuer_match: $issuer_match
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

export const CREATEAUTHVERIFICATIONMODEL = gql`
  mutation CreateAuthVerificationModel(
    $title: String
    $purpose: String
    $claims_match: String
    $issuer_match: String
    $client_id: String
    $client_secret: String
    $callback: String
    $custom_url_scheme: String
    $oob_prefix: String
    $session_duration: String
    $manual_verification: Boolean
  ) {
    createAuthVerificationModel(
      title: $title
      purpose: $purpose
      claims_match: $claims_match
      issuer_match: $issuer_match
      manual_verification: $manual_verification
      client_id: $client_id
      client_secret: $client_secret
      callback: $callback
      custom_url_scheme: $custom_url_scheme
      oob_prefix: $oob_prefix
      session_duration: $session_duration
    ) {
      id
      title
      verification_title
      purpose
      verification_link
      manual_verification
      issuer_match
      claims_match
      client_id
      client_secret
    }
  }
`;

export const CREATE_REQUEST_MEDIATOR_MESSAGE = gql`
  mutation createRequestMediatorMessage(
    $oob_code: String
    $source: String
    $message: String
    $reciever_did: String
  ) {
    createRequestMediatorMessage(
      oob_code: $oob_code
      source: $source
      message: $message
      reciever_did: $reciever_did
    )
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
  mutation createEncryptedSdJwtCredential($packedRequest: JSON) {
    createEncryptedSdJwtCredential(packedRequest: $packedRequest) {
      _encoded
      credential
    }
  }
`;
