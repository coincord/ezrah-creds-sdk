require("dotenv").config();
import { GraphQLClient, GraphQLResponse } from "graphql-request";
import graphqlClient from "./requester";
import { ADDCREDENTIALSWEBHOOK, ADDORGANIZATIONAPIKEY, CREATECREDENTIALS, CREATECREDENTIALSDK, CREATEVERIFICATIONMODEL, DELETECREDENTIALWEBHOOK, DELETEORGANIZATIONAPIKEY, UPDATECREDENTIALWEBHOOK, UPLOADORGANIZATIONIMAGE } from "./mutation";
import { ISSUEDCREDENTIALS, RESOLVEDID, TEMPLATES } from "./query";


class EzrahCredential {
  private client: GraphQLClient;

  constructor() {
    this.client = graphqlClient;
  }

  public getClient(): GraphQLClient {
    return this.client;
  }

  static async issueCredential (params: CreateCredential): Promise<VCredential | null> {
    
    try {
      const response: GraphQLResponse  = await graphqlClient.request(CREATECREDENTIALS, {
        claimID: params.claimID,
        did: params.did,
        claims: params.claims
      });
      if (!response?.data) {
        throw new Error("Error occurs while issuing credential");
      }
      return response.data as VCredential;
    } catch (error) {
      throw error;
    }
  }

  static async issueCredentialSDK (params: CreateCredentialSDK): Promise<CreateCredentialSDKResponse | null> {
    try {
      const response: GraphQLResponse  = await graphqlClient.request(CREATECREDENTIALSDK, {
        title: params.title,
        template_claim_id: params.template_claim_id,
        claims: params.claims
      });
      if (!response?.data) {
        throw new Error("Error occurs while issuing credential");
      }
      return response.data as CreateCredentialSDKResponse;
    } catch (error) {
      throw error;
    }
  }

  static async createVerificationModel (params: CreateVerificationModel): Promise<CreateVerificationModelResponse | null> {
    try {
      const response: GraphQLResponse  = await graphqlClient.request(CREATEVERIFICATIONMODEL, {
        title: params.title,
        purpose: params.purpose,
        claims_match: params.claims_match,
        issuer_match: params.issuer_match,
        manual_verification: params.manual_verification
      });
      if (!response?.data) {
        throw new Error("Error occurs while creating verification model");
      }
      return response.data as CreateVerificationModelResponse;
    } catch (error) {
      throw error;
    }
  }

  static async addCredentialsWebhook (params: CreateCredentialsWebhook): Promise<CreateCredentialsWebhookResponse | null> {

    try {
      const response: GraphQLResponse  = await graphqlClient.request(ADDCREDENTIALSWEBHOOK, {
        request_key: params.request_key,
        name: params.name,
        webhook_url: params.webhook_url
      });

      if (!response?.data) {
        throw new Error("Error occurs while adding credentials webhook");
      }

      return response.data as CreateCredentialsWebhookResponse;
    } catch (error) {
      throw error;
    }
  }

  static async updateCredentialWebhook (params: UpdateCredentialWebhook): Promise<CreateCredentialsWebhookResponse | null> {
    try {
      const response: GraphQLResponse  = await graphqlClient.request(UPDATECREDENTIALWEBHOOK, {
        webhook_id: params.webhook_id,
        request_key: params.request_key,
        name: params.name,
        webhook_url: params.webhook_url
      });

      if (!response?.data) {
        throw new Error("Error occurs while updating credentials webhook");
      }

      return response.data as CreateCredentialsWebhookResponse;
    } catch (error) {
      throw error;
    }
  }

  static async deleteCredentialWebhook (params: string) {
    try {
      const response: GraphQLResponse  = await graphqlClient.request(DELETECREDENTIALWEBHOOK, {
        webhook_id: params
      });

      if (!response?.data) {
        throw new Error("Error occurs while deleting credentials webhook");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async addOrganizationApiKey (params: string): Promise<AddOrganizationApiKeyResponse | null> {
    try {
      const response: GraphQLResponse  = await graphqlClient.request(ADDORGANIZATIONAPIKEY, {
        title: params
      });

      if (!response?.data) {
        throw new Error("Error occurs while adding organization api key");
      }

      return response.data as AddOrganizationApiKeyResponse;
    } catch (error) {
      throw error;
    }
  }

  static async deleteOrganizationApiKey (params: string) {
    try {
      const response: GraphQLResponse  = await graphqlClient.request(DELETEORGANIZATIONAPIKEY, {
        id: params
      });

      if (!response?.data) {
        throw new Error("Error occurs while deleting organization api key");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async uploadOrganizationLogo (params: File) {
    try {
      const response: GraphQLResponse = await graphqlClient.request(UPLOADORGANIZATIONIMAGE, {
        file: params
      });

      if (!response?.data) {
        throw new Error("Error occurs while uploading organization logo");
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async issuedCredentials (params: IssuedCredentials) : Promise<IssuedCredentialsResponse | null> {

    try {
      const response: GraphQLResponse = await graphqlClient.request(ISSUEDCREDENTIALS, {
        cursor: params.cursor || null,
        take: params.take || null,
        filter: {
          timeline: params.timeline || null,
          option: {
            status: params.status || null,
            template_id: params.template_id || null
          }
        }
      });

      if (!response?.data) {
        throw new Error('Error occurs while fetching credentials')
      }

      return response.data as IssuedCredentialsResponse
    } catch (error) {
      throw error;
    }
  }

  static async templates (): Promise<Templates | null> {

    try {
      const response : GraphQLResponse = await graphqlClient.request(TEMPLATES);

      if (!response.data) {
        throw new Error('Error occurs while feyching templates')
      }

      return response.data as Templates;
    } catch (error) {
      throw error;
    }
  }
  
  static async resolveDID (params: string): Promise<ResolvedDID | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(RESOLVEDID, {
        did: params
      });

      if (!response.data) {
        throw new Error('Error occurred while resolving DID')
      }
    } catch (error) {
      throw error;
    }
  }
}

export default EzrahCredential;