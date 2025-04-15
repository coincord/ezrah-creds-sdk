/* eslint-disable no-useless-catch */
import dotenv from 'dotenv';
dotenv.config();

import { GraphQLClient, GraphQLResponse } from 'graphql-request';
import graphqlClient from './requester';
import { CREATECREDENTIALS, CREATECREDENTIALSDK, CREATEVERIFICATIONMODEL } from './mutation';
import {
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
      if (!response?.createCredentialSDK) {
        throw new Error('Error occurs while issuing credential');
      }
      return response.createCredentialSDK as CredentialSDKResponse;
    } catch (error) {
      throw error;
    }
  }

  async createVerificationModel(
    params: CreateVerificationModel,
  ): Promise<VerificationModel | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(CREATEVERIFICATIONMODEL, {
        title: params.title,
        purpose: params.purpose,
        claims_match: params.claims_match,
        isser_match: params.isser_match,
        manual_verification: params.manual_verification,
      });

      if (!response?.createVerificationModel) {
        throw new Error('Error occurs while creating verification model');
      }
      return response.createVerificationModel as VerificationModel;
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

      if (!response?.issued_credentials) {
        throw new Error('Error occurs while fetching credentials');
      }

      return response.issued_credentials as IssuedCredentialsResponse;
    } catch (error) {
      throw error;
    }
  }

  async credentialAnalytics(): Promise<CredentialAnalytics | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(CREDENTIALANALYTICS);

      if (!response?.credentials_analytics) {
        throw new Error('Error occured while getting credentials analytics');
      }

      return response.credentials_analytics as CredentialAnalytics;
    } catch (error) {
      throw error;
    }
  }

  async templates(): Promise<Templates[] | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(TEMPLATES);

      if (!response.templates) {
        throw new Error('Error occurs while feyching templates');
      }

      return response.templates as Templates[];
    } catch (error) {
      throw error;
    }
  }

  async resolveDID(params: string): Promise<ResolvedDID | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(RESOLVEDID, {
        did: params,
      });

      if (!response.resolveDid) {
        throw new Error('Error occurred while resolving DID');
      }

      return response.resolveDid as ResolvedDID;
    } catch (error) {
      throw error;
    }
  }

  async verifcationModel(): Promise<VerificationModel[] | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(VERIFICATIONMODELS);

      if (!response?.verifications_models) {
        throw new Error('Error occured while fetching verifcation models');
      }

      return response.verifications_models as VerificationModel[];
    } catch (error) {
      throw error;
    }
  }

  async verifcationRequests(params: string): Promise<VerificationRequest[] | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(VERIFICATIONREQUESTS, {
        verification_model: params,
      });
      if (!response.verification_requests) {
        throw new Error('Error occured while fetching verifcation requests');
      }

      return response.verification_requests as VerificationRequest[];
    } catch (error) {
      throw error;
    }
  }

  async organization(): Promise<Organization | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(ORGANIZATION);

      if (!response.organization) {
        throw new Error('Error occured while fetching organization details');
      }

      return response.organization as Organization;
    } catch (error) {
      throw error;
    }
  }

  async webhooks(): Promise<CredentialWebHook[] | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(CREDENTIALWEBHOOKS);

      if (!response?.credential_webhooks) {
        throw new Error('Error occured while fetching webhooks');
      }

      return response.credential_webhooks as CredentialWebHook[];
    } catch (error) {
      throw error;
    }
  }
}

export default EzrahCredential;
