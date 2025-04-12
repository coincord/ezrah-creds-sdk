/* eslint-disable no-useless-catch */
import dotenv from 'dotenv';
dotenv.config();

import { GraphQLClient, GraphQLResponse } from 'graphql-request';
import graphqlClient from './requester';
import {
  ADDCREDENTIALSWEBHOOK,
  ADDORGANIZATIONAPIKEY,
  CREATECREDENTIALS,
  CREATECREDENTIALSDK,
  CREATEVERIFICATIONMODEL,
  DELETECREDENTIALWEBHOOK,
  DELETEORGANIZATIONAPIKEY,
  UPDATECREDENTIALWEBHOOK,
  UPLOADORGANIZATIONIMAGE,
} from './mutation';
import {
  APIKEYS,
  CREDENTIALANALYTICS,
  CREDENTIALWEBHOOKS,
  ISSUEDCREDENTIALS,
  ORGANIZATION,
  RESOLVEDID,
  TEMPLATES,
  VERIFICATIONMODELS,
  VERIFICATIONREQUESTS,
} from './query';

class EzrahCredential {
  private client: GraphQLClient;

  constructor() {
    this.client = graphqlClient;
  }

  public getClient(): GraphQLClient {
    return this.client;
  }

  async issueCredential(params: CreateCredential): Promise<VCredential | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(CREATECREDENTIALS, {
        claimID: params.claimID,
        did: params.did,
        claims: params.claims,
      });
      if (!response?.data) {
        throw new Error('Error occurs while issuing credential');
      }
      return response.data as VCredential;
    } catch (error) {
      throw error;
    }
  }

  async issueCredentialSDK(params: CreateCredentialSDK): Promise<CredentialSDKResponse | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(CREATECREDENTIALSDK, {
        title: params.title,
        template_claim_id: params.template_claim_id,
        claims: params.claims,
      });
      if (!response?.data) {
        throw new Error('Error occurs while issuing credential');
      }
      return response.data as CredentialSDKResponse;
    } catch (error) {
      throw error;
    }
  }

  async createVerificationModel(
    params: CreateVerificationModel,
  ): Promise<CreateVerificationModelRes | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(CREATEVERIFICATIONMODEL, {
        title: params.title,
        purpose: params.purpose,
        claims_match: params.claims_match,
        issuer_match: params.issuer_match,
        manual_verification: params.manual_verification,
      });
      if (!response?.data) {
        throw new Error('Error occurs while creating verification model');
      }
      return response.data as CreateVerificationModelRes;
    } catch (error) {
      throw error;
    }
  }

  async addCredentialsWebhook(
    params: CreateCredentialsWebhook,
  ): Promise<CredentialsWebhookResponse | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(ADDCREDENTIALSWEBHOOK, {
        request_key: params.request_key,
        name: params.name,
        webhook_url: params.webhook_url,
      });

      if (!response?.data) {
        throw new Error('Error occurs while adding credentials webhook');
      }

      return response.data as CredentialsWebhookResponse;
    } catch (error) {
      throw error;
    }
  }

  async updateCredentialWebhook(
    params: UpdateCredentialWebhook,
  ): Promise<UpdateCredentialWebhookResponse | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(UPDATECREDENTIALWEBHOOK, {
        webhook_id: params.webhook_id,
        request_key: params.request_key,
        name: params.name,
        webhook_url: params.webhook_url,
      });

      if (!response?.data) {
        throw new Error('Error occurs while updating credentials webhook');
      }

      return response.data as UpdateCredentialWebhookResponse;
    } catch (error) {
      throw error;
    }
  }

  async deleteCredentialWebhook(params: string) {
    try {
      const response: GraphQLResponse = await graphqlClient.request(DELETECREDENTIALWEBHOOK, {
        webhook_id: params,
      });

      if (!response?.data) {
        throw new Error('Error occurs while deleting credentials webhook');
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async addOrganizationApiKey(params: string): Promise<OrganizationApiKeyResponse | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(ADDORGANIZATIONAPIKEY, {
        title: params,
      });

      if (!response?.data) {
        throw new Error('Error occurs while adding organization api key');
      }

      return response.data as OrganizationApiKeyResponse;
    } catch (error) {
      throw error;
    }
  }

  async deleteOrganizationApiKey(params: string) {
    try {
      const response: GraphQLResponse = await graphqlClient.request(DELETEORGANIZATIONAPIKEY, {
        id: params,
      });

      if (!response?.data) {
        throw new Error('Error occurs while deleting organization api key');
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async uploadOrganizationLogo(params: File): Promise<string> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(UPLOADORGANIZATIONIMAGE, {
        file: params,
      });

      if (!response?.data) {
        throw new Error('Error occurs while uploading organization logo');
      }
      return response.data as string;
    } catch (error) {
      throw error;
    }
  }

  async issuedCredentials(params?: IssuedCredentials): Promise<IssuedCredentialsResponse | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(ISSUEDCREDENTIALS, {
        cursor: params?.cursor || null,
        take: params?.take || null,
        filter: {
          timeline: params?.timeline || null,
          option: {
            status: params?.status || null,
            template_id: params?.template_id || null,
          },
        },
      });

      if (!response?.data) {
        throw new Error('Error occurs while fetching credentials');
      }

      return response.data as IssuedCredentialsResponse;
    } catch (error) {
      throw error;
    }
  }

  async credentialAnalytics(): Promise<CredentialAnalytics | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(CREDENTIALANALYTICS);

      if (!response?.data) {
        throw new Error('Error occured while getting credentials analytics');
      }

      return response.data as CredentialAnalytics;
    } catch (error) {
      throw error;
    }
  }

  async templates(): Promise<TemplateListing | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(TEMPLATES);

      if (!response.data) {
        throw new Error('Error occurs while feyching templates');
      }

      return response.data as TemplateListing;
    } catch (error) {
      throw error;
    }
  }

  async resolveDID(params: string): Promise<ResolvedDID | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(RESOLVEDID, {
        did: params,
      });

      if (!response.data) {
        throw new Error('Error occurred while resolving DID');
      }

      return response.data as ResolvedDID;
    } catch (error) {
      throw error;
    }
  }

  async verifcationModel(): Promise<VerificationModelListing | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(VERIFICATIONMODELS);

      if (!response?.data) {
        throw new Error('Error occured while fetching verifcation models');
      }

      return response.data as VerificationModelListing;
    } catch (error) {
      throw error;
    }
  }

  async verifcationRequests(params: string): Promise<VerificationRequestListing | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(VERIFICATIONREQUESTS, {
        verifcation_model: params,
      });

      if (!response.data) {
        throw new Error('Error occured while fetching verifcation requests');
      }

      return response.data as VerificationRequestListing;
    } catch (error) {
      throw error;
    }
  }

  async apiKeys(): Promise<OrganizationApiKeyListing | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(APIKEYS);

      if (!response.data) {
        throw new Error('Error occured while fetching api keys');
      }
      return response.data as OrganizationApiKeyListing;
    } catch (error) {
      throw error;
    }
  }

  async organization(): Promise<OrganizationDetails | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(ORGANIZATION);

      if (!response.data) {
        throw new Error('Error occured while fetching organization details');
      }

      return response.data as OrganizationDetails;
    } catch (error) {
      throw error;
    }
  }

  async webhooks(): Promise<CredentialWebhookListings | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(CREDENTIALWEBHOOKS);

      if (!response?.data) {
        throw new Error('Error occured while fetching webhooks');
      }

      return response.data as CredentialWebhookListings;
    } catch (error) {
      throw error;
    }
  }
}

export default EzrahCredential;
