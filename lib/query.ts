import { gql } from "graphql-request";

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
