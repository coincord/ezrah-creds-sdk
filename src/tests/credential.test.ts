require("dotenv").config();
import { GraphQLClient } from 'graphql-request';
import EzrahCredential from '../lib';

jest.mock('graphl-request', () => {
  const mClient = {
    request: jest.fn(),
  };

  return {
    GraphQLClient: jest.fn(() => mClient),
    gql: jest.fn((strings) => strings),
  }
})

describe('Credential', () => {

  let ezrahCredential: EzrahCredential;
  let graphQLClient: GraphQLClient;
  let template_claim_id: string;
  let organizationDID: string;
  let organizationAPIKey: string;
  let webhookID: string;

  beforeEach(() => {
    jest.clearAllMocks();
    ezrahCredential = new EzrahCredential();
    graphQLClient = ezrahCredential.getClient();
  });

  it('Create a GraphQLClient instance', () => {
    expect(graphQLClient).toHaveBeenCalledTimes(1);
    expect(ezrahCredential.getClient()).toBeInstanceOf(GraphQLClient);
  });

  it('Organization Details', async () => {
    const response = await ezrahCredential.organization();

    expect(response?.organization.id).toBeDefined();
    expect(response?.organization.name).toBeDefined();
    expect(response?.organization.domain).toBeDefined();
    expect(response?.organization.alias).toBeDefined();

    organizationDID = response?.organization.identifier.did!;
    organizationAPIKey = response?.organization.api_key!;
  });

  it(`Get Templates Listing`, async () => {
    const response = await ezrahCredential.templates();

    expect(response?.templates.length).toBeGreaterThan(0);
    expect(response?.templates[0].id).toBeDefined();
    expect(response?.templates[0].title).toBeDefined();

    template_claim_id = response?.templates[0].id!;
  });

  it('Issue A Credential', async () => {
    const params: CreateCredentialSDK = {
      title: 'Emplployee Onboarding',
      template_claim_id: template_claim_id,
      claims: { name: "John Doe", age: "30"}
    };

    const response = await ezrahCredential.issueCredentialSDK(params);
    expect(typeof response?.createCredentialSDK.pending_id).toBe('string');
    expect(typeof response?.createCredentialSDK.url).toBe('string');
  });

  it('Ceate Verification Model', async () => {

    const params: CreateVerificationModel = {
      title: 'Verification Model',
      purpose: 'Verify Employee',
      claims_match: `name, age, date_of_birth`,
      issuer_match: organizationDID,
      manual_verification: false
    };

    const response = await ezrahCredential.createVerificationModel(params);
    expect(response?.createVerificationModel.id).toBeDefined();
    expect(response?.createVerificationModel.title).toBeDefined();

  });

  it('Add Webhook', async () => {
    const params: CreateCredentialsWebhook = {
      request_key: organizationAPIKey,
      name: 'Jest Test Webhook',
      webhook_url: 'https://example.com/webhook'
    };

    const response = await ezrahCredential.addCredentialsWebhook(params);

    expect(response?.addCredentialsWebhook.id).toBeDefined();
    expect(response?.addCredentialsWebhook.name).toBeDefined();

    webhookID = response?.addCredentialsWebhook.id!;
  });

  it('Update Webhook', async () => {
    const params: UpdateCredentialWebhook = {
      webhook_id: webhookID,
      request_key: organizationAPIKey,
      name: 'Updated Jest Test Webhook',
      webhook_url: 'https://example.com/webhook'
    };

    const response = await ezrahCredential.updateCredentialWebhook(params);

    expect(response?.updateCredentialWebhook.id).toBeDefined();
    expect(response?.updateCredentialWebhook.name).toBe('Updated Jest Test Webhook');
  });

});