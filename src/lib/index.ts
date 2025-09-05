/* eslint-disable no-useless-catch */
import dotenv from 'dotenv';
dotenv.config();

import { GraphQLClient, GraphQLResponse } from 'graphql-request';

// OPTIMIZE: Ignorable error appears here in jest testing env, with regard to ESM module import, resolve soon
import graphqlClient from './requester.js';
import {
  ADDCREDENTIALSWEBHOOK,
  CREATE_ENCRYPTED_SDJWT_CREDENTIAL,
  CREATE_REQUEST_MEDIATOR_MESSAGE,
  CREATEAUTHVERIFICATIONMODEL,
  CREATECREDENTIALS,
  CREATECREDENTIALSDK,
  CREATETEMPLATESTRUCTURE,
  CREATEVERIFICATIONMODEL,
  DELETECREDENTIALWEBHOOK,
  POLICY_CONTROL_MUTATION,
  UPDATECREDENTIALWEBHOOK,
} from './mutation.js';
import {
  CREDENTIALANALYTICS,
  CREDENTIALWEBHOOKS,
  ISSUEDCREDENTIALS,
  ORGANIZATION,
  RESOLVEDID,
  TEMPLATES,
  VERIFICATIONMODELS,
  VERIFICATIONREQUESTS,
} from './query.js';
import { v4 } from 'uuid';
import { DisclosureFrame } from '@sd-jwt/types';
import SdJwtHelper from '@coincord/sd-jwt-helper';
import { decryptRSAData } from './encryption.js';
import { decodeBase64url } from './utils.js';

/**
 *  Ezrah Credential
 */
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
        claims: typeof params.claims == 'string' ? params.claimID : JSON.stringify(params.claims),
      });
      if (!response?.createCredential) {
        throw new Error('Error occurs while issuing credential');
      }
      return response.createCredential as VCredential;
    } catch (error) {
      throw error;
    }
  }

  async createTemplateStructure(params: CreateTemplateStructure): Promise<Templates> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(CREATETEMPLATESTRUCTURE, {
        title: params.title,
        claims: params.claims,
        description: params.description,
      });

      if (!response?.createCredentialTemplateStructure) {
        throw new Error('Error occurs while creating template structures');
      }

      return response.createCredentialTemplateStructure as Templates;
    } catch (error) {
      throw error;
    }
  }

  async issueCredentialSDK(
    params: CreateCredentialSDK,
    options?: {
      policy_control: boolean;
    },
  ): Promise<CredentialSDKResponse | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(CREATECREDENTIALSDK, {
        title: params.title,
        template_claim_id: params.template_claim_id,
        claims: params.claims,
        policy_control: options?.policy_control ? options.policy_control : false,
      });
      if (!response?.createCredentialSDK) {
        throw new Error('Error occurs while issuing credential');
      }
      return response.createCredentialSDK as CredentialSDKResponse;
    } catch (error) {
      throw error;
    }
  }

  async policyControlCredential(params: PolicyUpdateCredentialParams): Promise<boolean> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(POLICY_CONTROL_MUTATION, {
        credential_urn: params.credential_urn,
        action: params.action,
        state: params.state,
      });
      if (!response?.policyUpdateCredential) {
        throw new Error('Error occurs while issuing credential');
      }
      return response.policyUpdateCredential as boolean;
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
        issuer_match: params.issuer_match,
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

  async createAuthVerificationModel(
    params: CreateAuthVerificationModel,
  ): Promise<AuthVerificationModel | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(CREATEAUTHVERIFICATIONMODEL, {
        title: params.title,
        purpose: params.purpose,
        claims_match: params.claims_match,
        issuer_match: params.issuer_match,
        manual_verification: params.manual_verification,
        client_id: params.client_id,
        client_secret: params.client_secret,
        oob_prefix: params.oob_prefix,
        callback: params.callback,
        custom_url_scheme: params.custom_url_scheme,
        session_duration: params.session_duration,
      });

      if (!response?.createAuthVerificationModel) {
        throw new Error('Error occurs while creating verification model');
      }
      return response.createAuthVerificationModel as AuthVerificationModel;
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

      if (!response?.addCredentialsWebhook) {
        throw new Error('Error occurs while adding credentials webhook');
      }

      return response.addCredentialsWebhook as CredentialsWebhookResponse;
    } catch (error) {
      throw error;
    }
  }

  async createRequestMessage(params: CreateRequestMediatorMessage): Promise<boolean | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(
        CREATE_REQUEST_MEDIATOR_MESSAGE,
        {
          source: params.source,
          oob_code: params.oob_code,
          message: params.message,
          reciever_did: params.reciever_did,
          session_code: params.session_code,
        },
      );

      if (!response?.createRequestMediatorMessage) {
        throw new Error('Error occurs while adding sending request message');
      }

      return response.createRequestMediatorMessage as boolean;
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

      if (!response?.updateCredentialWebhook) {
        throw new Error('Error occurs while updating credentials webhook');
      }

      return response.updateCredentialWebhook as UpdateCredentialWebhookResponse;
    } catch (error) {
      throw error;
    }
  }

  async deleteCredentialWebhook(params: string) {
    try {
      const response: GraphQLResponse = await graphqlClient.request(DELETECREDENTIALWEBHOOK, {
        webhook_id: params,
      });
      console.log(response);
      if (!response.deleteCredentialWebhook) {
        throw new Error('Error occurs while deleting credentials webhook');
      }

      return response.deleteCredentialWebhook;
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

  async verificationModels(): Promise<VerificationModel[] | null> {
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

  async verificationRequests(params: string): Promise<VerificationRequest[] | null> {
    try {
      const response: GraphQLResponse = await graphqlClient.request(VERIFICATIONREQUESTS, {
        verification_model: params,
      });
      console.log(response);
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

  async issueEncryptedSDJWT<T extends Record<string, unknown>>(
    claims: T,
    disclosure: Array<keyof T>,
    reciever_pk: string,
    options?: {
      policy_control: boolean;
    },
  ): Promise<EncryptedSdjwtResponse> {
    try {
      // @ts-expect-error TODO: Resolve on type issues between disclosure aray and disclosure frame
      const disclosureFrame: DisclosureFrame<T> = {
        _sd: disclosure,
      };

      const sdHasher = new SdJwtHelper.SDPackHash(() => v4());
      const { _hash_alg, packedClaims, disclosures } = await sdHasher.packEncoding(
        claims,
        disclosureFrame,
      );

      const encryptedDislosure = await sdHasher.generateEncryptedDisclosure(
        disclosures,
        reciever_pk,
      );

      const policy_control = options?.policy_control ? options.policy_control : false;

      const response: GraphQLResponse = await graphqlClient.request(
        CREATE_ENCRYPTED_SDJWT_CREDENTIAL,
        {
          packedRequest: {
            _hash_alg,
            packedClaims,
            encrypted_disclosures: encryptedDislosure,
          },
          policy_control,
        },
      );

      return response.createEncryptedSdJwtCredential as EncryptedSdjwtResponse;
    } catch (error) {
      throw error;
    }
  }

  /** Decrypt Encrypted presentation payload with the supplied RSA private key from the ezrah account
   *
   * @param enc EncPayload
   * @param rsaPrivateKey string
   * @returns
   */
  async decryptEncryptedWebhookPayload(
    enc: {
      event: string;
      data: EncPayload | string;
      encrypted: boolean;
    },
    rsaPrivateKey: string,
  ): Promise<{
    presentations: { payload: { [x: string]: unknown; presented_claims: object } }[];
    event: string;
  }> {
    let decryptedData: {
      presentations: [{ presentation: string }];
    } | null = null;
    if (enc.encrypted) {
      decryptedData = JSON.parse(await decryptRSAData(enc.data as EncPayload, rsaPrivateKey)) as {
        presentations: [{ presentation: string }];
      };
    } else {
      decryptedData = JSON.parse(enc.data as string) as {
        presentations: [{ presentation: string }];
      };
    }

    const presentations = decryptedData.presentations;
    const pData = presentations.map((p: { presentation: string }) => {
      const split_p = p.presentation.split('.');
      const [header, payload, rest] = split_p;
      // split the rest of the data and attempt decoding after the main signature value

      const restValues = rest.split('~');
      const [signature, ...restValue] = restValues;
      const presentedClaims = restValue
        .map((v) => {
          if (v === '') {
            return {};
          } else {
            const decodedV = JSON.parse(decodeBase64url(v));
            return {
              [decodedV[1]]: decodedV[2],
            };
          }
        })
        .reduce((p, c) => ({ ...p, ...c }), {});

      const pDecoded = {
        header: JSON.parse(decodeBase64url(header)),
        payload: { ...JSON.parse(decodeBase64url(payload)), presented_claims: presentedClaims },
        signature: signature,
      };
      return pDecoded;
    });

    return {
      presentations: pData,
      event: enc.event,
    };
  }
}

export default EzrahCredential;
