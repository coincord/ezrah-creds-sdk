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
  let apiKeyID: string;
  let testlogo = new File(['dummy content'], 'testlogo.png', { type: 'image/png' });

  const dateRange = (() => {
    const now = new Date();
    const past = new Date();
    past.setMonth(now.getMonth() - 6);
  
    const format = (date: Date) =>
      `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
  
    return `${format(past)}-${format(now)}`;
  })();
  

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

  it('Delete Webhook', async () => {
    const response = await ezrahCredential.deleteCredentialWebhook(webhookID);

    expect(typeof response).toBe('boolean');
    expect(response).toBe(true);
  });

  it('Add Api Key', async () => {
    const params: string = 'Jest Test API Key';

    const response = await ezrahCredential.addOrganizationApiKey(params);

    expect(response?.addOrganizationApiKey.id).toBeDefined();
    expect(response?.addOrganizationApiKey.api_key).toBeDefined();
    expect(response?.addOrganizationApiKey.title).toBe(params);

    apiKeyID = response?.addOrganizationApiKey.id!;
    expect(apiKeyID).toBeDefined();
  });

  it('Delete Api Key', async () => {
    const response = await ezrahCredential.deleteOrganizationApiKey(apiKeyID);

    expect(typeof response).toBe('boolean');
    expect(response).toBe(true);
  });

  it('Change Organization Logo', async () => {

    const response = await ezrahCredential.uploadOrganizationLogo(testlogo);

    expect(typeof response).toBe('string');
  })

  it('Get Issued Credentials', async () => {
    const response = await ezrahCredential.issuedCredentials();

    expect(typeof response?.issued_credentials).toBe('object');
    expect(typeof response?.issued_credentials.credentials).toBe("array");
    expect(typeof response?.issued_credentials.total_count).toBe("number");
    expect(typeof response?.issued_credentials.size).toBe("number");
    expect(response?.issued_credentials.credentials.length).toBeGreaterThan(0)
  });

  it ('Issued Credentials With Filter', async () => {

    const filter: IssuedCredentials = {
      timeline: dateRange,
      status: ['CLAIMED', 'ISSUED'],
      template_id: undefined ,
      take: 10,
      cursor: ''
    }

    const response = await ezrahCredential.issuedCredentials(filter);

    expect(typeof response?.issued_credentials).toBe('object');
    expect(typeof response?.issued_credentials.credentials).toBe("array");
    expect(typeof response?.issued_credentials.total_count).toBe("number");
    expect(typeof response?.issued_credentials.size).toBe("number");
    expect(response?.issued_credentials.credentials.length).toBeGreaterThan(0)

  });
});