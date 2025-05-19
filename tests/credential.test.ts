import dotenv from 'dotenv';
import { ed25519 } from '@noble/curves/ed25519';
dotenv.config();

import { jest } from '@jest/globals';
import EzrahCredential from '../src/lib';
import { GraphQLClient } from 'graphql-request';
import { bytesToHex } from '@noble/curves/abstract/utils';

jest.setTimeout(30000);

describe('Credential', () => {
  let ezrahCredential: EzrahCredential;
  let graphQLClient: GraphQLClient;
  let template_claim_id: string;
  let organizationDID: string;
  let organizationAPIKey: string;
  let webhookID: string;
  // const testlogo = new File(['dummy content'], 'testlogo.png', { type: 'image/png' });
  let verificationModelID: string;

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
    const spy = jest.spyOn(EzrahCredential.prototype, 'getClient');

    ezrahCredential = new EzrahCredential(); // this triggers the spy
    graphQLClient = ezrahCredential.getClient();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(graphQLClient).toBeInstanceOf(GraphQLClient);

    spy.mockRestore();
  });

  it('Organization Details', async () => {
    const response = await ezrahCredential.organization();

    expect(response?.id).toBeDefined();
    expect(response?.name).toBeDefined();
    expect(response?.domain).toBeDefined();
    expect(response?.alias).toBeDefined();

    organizationDID = response?.identifier.did ?? '';
    expect(organizationDID).toBeDefined();
    expect(response?.identifier.did).toBeDefined();
    organizationAPIKey = response?.api_key ?? '';
    expect(organizationAPIKey).toBeDefined();
  });

  it('CreatesCredentialTemplate', async () => {
    const credentialTemplate = await ezrahCredential.createTemplateStructure({
      claims: 'first_name,last_name,other_details',
      description: 'test template id',
      title: 'Test TemplateID',
    });

    expect(credentialTemplate.id).toBeDefined();
  });

  it(`Get Templates Listing`, async () => {
    const response = await ezrahCredential.templates();

    expect(response?.length).toBeGreaterThan(2);
    expect(response?.[0].id).toBeDefined();
    expect(response?.[0].title).toBeDefined();

    template_claim_id = response?.[0].id ?? '';
    expect(template_claim_id).toBeDefined();
  });

  it('Issue A Credential', async () => {
    const params: CreateCredentialSDK = {
      title: 'Emplployee Onboarding',
      template_claim_id: template_claim_id,
      claims: {
        first_name: 'Lampety',
        last_name: 'Yamalamala',
        date_of_birth: '2005-05-15',
        email: 'laminea.yamal@example.com',
        phone_number: '+1234567890',
        address: '123 Main St, Springfield',
        emergency_contact_name: 'Jane Doe',
        emergency_contact_phone: '+1987654321',
        employment_start_date: '2022-01-10',
        job_title: 'Soccer Player',
        department: 'Football',
        background_check_status: 'Cleared',
        drug_test_result: 'Negative',
      },
    };

    const response = await ezrahCredential.issueCredentialSDK(params);
    console.log(response);
    expect(typeof response?.pending_id).toBe('string');
    expect(typeof response?.url).toBe('string');
  });

  it('Issue an Encrypted Credential', async () => {
    const receiverPk = ed25519.utils.randomPrivateKey();
    const receiverPuk = ed25519.getPublicKey(receiverPk);

    const subjectDid = 'did:ezrah:0xE69A40A839F017148B1B6b36c38036E3936B6531';

    const params: CreateCredentialSDK = {
      title: 'Emplployee Onboarding',
      template_claim_id: template_claim_id,
      claims: {
        issuance_data: new Date().toISOString(),
        sub: subjectDid,
        first_name: 'Lampety',
        last_name: 'Yamalamala',
        date_of_birth: '2005-05-15',
        email: 'laminea.yamal@example.com',
        phone_number: '+1234567890',
        address: '123 Main St, Springfield',
        emergency_contact_name: 'Jane Doe',
        emergency_contact_phone: '+1987654321',
        employment_start_date: '2022-01-10',
        job_title: 'Soccer Player',
        department: 'Football',
        background_check_status: 'Cleared',
        drug_test_result: 'Negative',
      },
    };
    const response = await ezrahCredential.createEncryptedSdjwtCreds(
      params.claims,
      ['first_name', 'last_name', 'date_of_birth', 'email', 'address'],
      bytesToHex(receiverPuk),
    );

    console.log(response);
    expect(typeof response?._encoded).toBe('string');
  });

  it('Ceate Verification Model', async () => {
    const params: CreateVerificationModel = {
      title: 'Employee Freelancing',
      purpose: 'Freelance Employee',
      claims_match: `name, age, date_of_birth, jobtype, description`,
      isser_match: organizationDID,
      manual_verification: true,
    };

    const response = await ezrahCredential.createVerificationModel(params);
    expect(response?.id).toBeDefined();
    expect(response?.title).toBeDefined();
    expect(response?.purpose).toBe('Freelance Employee');
    expect(response?.manual_verification).toBe(true);
    expect(response?.title).toBe('Employee Freelancing');
  });

  it('Add Webhook - One', async () => {
    const params: CreateCredentialsWebhook = {
      request_key: organizationAPIKey,
      name: 'Behold the hour is at hands',
      webhook_url: 'https://example.com/hour/at/hand',
    };

    const response = await ezrahCredential.addCredentialsWebhook(params);

    expect(response?.id).toBeDefined();
    expect(response?.name).toBeDefined();

    webhookID = response?.id ?? '';

    expect(webhookID).toBeDefined();
  });

  it('Add Webhook - Two', async () => {
    const params: CreateCredentialsWebhook = {
      request_key: organizationAPIKey,
      name: 'Airline REaltime',
      webhook_url: 'https://example.com/realtime/airline',
    };

    const response = await ezrahCredential.addCredentialsWebhook(params);

    expect(response?.id).toBeDefined();
    expect(response?.name).toBeDefined();
  });

  it('Add Webhook - Three', async () => {
    const params: CreateCredentialsWebhook = {
      request_key: organizationAPIKey,
      name: 'Webhook Resting',
      webhook_url: 'https://example.com/ajfx/Testing',
    };

    const response = await ezrahCredential.addCredentialsWebhook(params);

    expect(response?.id).toBeDefined();
    expect(response?.name).toBeDefined();
  });

  it('Update Webhook - One ', async () => {
    const params: UpdateCredentialWebhook = {
      webhook_id: webhookID,
      request_key: organizationAPIKey,
      name: '2 Webhook Sign Two',
      webhook_url: 'https://example.com/webhook/fx/two',
    };

    const response = await ezrahCredential.updateCredentialWebhook(params);

    expect(response?.id).toBeDefined();
    expect(response?.name).toBe('2 Webhook Sign Two');
  });

  it('Delete Webhook - One ', async () => {
    const response = await ezrahCredential.deleteCredentialWebhook(webhookID);

    expect(typeof response).toBe('boolean');
    expect(response).toBe(true);
  });

  it('List Issued Credentials', async () => {
    const response = await ezrahCredential.issuedCredentials();

    expect(typeof response).toBe('object');
    expect(typeof response?.credentials).toBe('object');
    expect(typeof response?.total_count).toBe('number');
    expect(typeof response?.size).toBe('number');
    expect(response?.credentials.length).toBeGreaterThan(0);
  });

  it('List Issued Credentials With Filter', async () => {
    const filter: IssuedCredentials = {
      timeline: dateRange,
      status: ['CLAIMED', 'ISSUED'],
      template_id: undefined,
      take: 10,
      cursor: '',
    };

    const response = await ezrahCredential.issuedCredentials(filter);

    expect(typeof response).toBe('object');
    expect(typeof response?.credentials).toBe('object');
    expect(typeof response?.total_count).toBe('number');
    expect(typeof response?.size).toBe('number');
    expect(response?.credentials.length).toBeGreaterThan(0);
  });

  it('Credential Analytics', async () => {
    const response = await ezrahCredential.credentialAnalytics();

    expect(typeof response?.CLAIMED).toBe('number');
    expect(typeof response?.ISSUED).toBe('number');
    expect(typeof response?.REVOKED).toBe('number');
    expect(typeof response?.EXPIRED).toBe('number');
  });

  // it('Resolve DID', async () => {
  //   const response = await ezrahCredential.resolveDID(organizationDID);

  //   expect(typeof response?.resolveDid.did).toBe('string');
  //   expect(typeof response?.resolveDid.resolvedDID).toBe('object');
  // });

  it('List Verification Models', async () => {
    const response = await ezrahCredential.verifcationModel();

    expect(response?.length).toBeGreaterThan(0);
    expect(typeof response).toBe('object');
    expect(typeof response?.[0].title).toBe('string');
    expect(typeof response?.[0].manual_verification).toBe('boolean');

    verificationModelID = response?.[0].id ?? '';
    expect(verificationModelID).toBeDefined();
  });

  it('Verification Request', async () => {
    const response = await ezrahCredential.verifcationRequests(verificationModelID);

    expect(typeof response)?.toBe('object');
  });

  it('List Webhooks', async () => {
    const response = await ezrahCredential.webhooks();
    console.log(response);
    expect(typeof response).toBe('object');
    expect(response?.length).toBeGreaterThan(0);
    expect(typeof response?.[0].id).toBe('string');
    expect(typeof response?.[0].name).toBe('string');
    expect(typeof response?.[0].webhook_url).toBe('string');
  });
});
