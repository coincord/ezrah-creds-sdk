import dotenv from 'dotenv';
dotenv.config();

import { jest } from '@jest/globals';
import EzrahCredential from '../src/lib';
import { GraphQLClient } from 'graphql-request';
import { ed25519 } from '@noble/curves/ed25519';
import { bytesToHex } from '@noble/curves/utils';

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
  let subIssuerDID: string;

  let credential_urn: string | null;
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

  it.skip('Create a GraphQLClient instance', () => {
    const spy = jest.spyOn(EzrahCredential.prototype, 'getClient');

    ezrahCredential = new EzrahCredential(); // this triggers the spy
    graphQLClient = ezrahCredential.getClient();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(graphQLClient).toBeInstanceOf(GraphQLClient);

    spy.mockRestore();
  });

  it.skip('Organization Details', async () => {
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

  it('List Sub-Issuers', async () => {
    const response = await ezrahCredential.subIssuers();

    expect(Array.isArray(response)).toBe(true);
    expect(response?.length).toBeGreaterThanOrEqual(0);

    console.log('Sub issuer list', response);
    if (response && response.length > 0) {
      expect(response[0].did).toBeDefined();
      expect(response[0].name).toBeDefined();
      expect(typeof response[0].did).toBe('string');
      expect(typeof response[0].name).toBe('string');
    }
  });

  it('Create Sub-Issuer', async () => {
    const params = {
      name: `Test Sub-Issuer ${Date.now()}`,
      description: 'Test sub-issuer for SDK testing',
      domain: 'test-sub-issuer.example.com',
    };

    const response = await ezrahCredential.createSubIssuer(params);

    console.log(response);
    expect(response).toBeDefined();
    expect(response.did).toBeDefined();
    expect(response.name).toBeDefined();
    expect(typeof response.did).toBe('string');
    expect(typeof response.name).toBe('string');
    expect(response.name).toBe(params.name);

    subIssuerDID = response.did;
  });

  it('Verify Sub-Issuer in List After Creation', async () => {
    if (!subIssuerDID) {
      console.log('Skipping verification test as no sub-issuer was created');
      return;
    }

    const response = await ezrahCredential.subIssuers();

    expect(Array.isArray(response)).toBe(true);

    if (response?.length > 0) {
      const createdSubIssuer = response?.find((subIssuer) => subIssuer.did === subIssuerDID);
      expect(createdSubIssuer).toBeDefined();
      expect(createdSubIssuer?.did).toBe(subIssuerDID);
    }
  });

  it.skip('CreatesCredentialTemplate', async () => {
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
    const receiverPk = ed25519.utils.randomSecretKey();
    const receiverPuk = ed25519.getPublicKey(receiverPk);

    // conver both to hex.
    const receiverPkHex = bytesToHex(receiverPk);
    const receiverPukhex = bytesToHex(receiverPuk);

    const subjectDid = 'did:ezrah:0x32511ABa1630f5526669d57325611A68aA240127';

    const params: CreateCredentialSDK = {
      title: 'Emplployee Onboarding',
      template_claim_id: template_claim_id,
      claims: {
        issuance_date: new Date().toISOString(),
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
    const response = await ezrahCredential.issueEncryptedSDJWT(
      params.claims,
      [
        'first_name',
        'last_name',
        'date_of_birth',
        'email',
        'address',
        'job_title',
        'emergency_contact_name',
        'emergency_contact_phone',
        'background_check_status',
      ],
      [receiverPukhex],
      // ['efdedfabd5db14876e28b8a920a63455736e2f2d8a85bee37db9c8381068534b'],
      {
        policy_control: true,
      },
      // bytesToHex(receiverPuk),
    );

    credential_urn = response.urn as string;

    console.log('Issue creds response', response);

    expect(typeof response?._encoded).toBe('string');
  });

  it('Issue Encrypted Credential with Sub-Issuer', async () => {
    const receiverPk = ed25519.utils.randomSecretKey();
    const receiverPuk = ed25519.getPublicKey(receiverPk);

    const receiverPkHex = bytesToHex(receiverPk);
    const receiverPukhex = bytesToHex(receiverPuk);

    const subjectDid = 'did:ezrah:0x32511ABa1630f5526669d57325611A68aA240127';

    const params = {
      title: 'Sub-Issuer Employee Credential',
      template_claim_id: template_claim_id,
      claims: {
        issuance_date: new Date().toISOString(),
        sub: subjectDid,
        first_name: 'John',
        last_name: 'SubIssuer',
        email: 'john.subissuer@example.com',
        department: 'Sub-Issuer Department',
      },
    };

    const response = await ezrahCredential.issueEncryptedSDJWT(
      params.claims,
      ['first_name', 'last_name', 'email', 'department'],
      [receiverPukhex],
      {
        policy_control: true,
        sub_issuer_did: subIssuerDID,
      },
    );

    console.log('Encrypoted sub-issuer credential', response);

    expect(response).toBeDefined();
    expect(typeof response?._encoded).toBe('string');
    expect(response?.urn).toBeDefined();
  });

  it('Change the state of the credential', async () => {
    console.log('The Credential URN : ', credential_urn);
    const response = await ezrahCredential.policyControlCredential({
      credential_urn: credential_urn as string,
      action: 'REVOKE',
      state: true,
    });

    console.log(response);
    expect(response).toBeTruthy();
  });

  it.skip('Ceate Verification Model', async () => {
    const params: CreateVerificationModel = {
      title: 'Employee Freelancing',
      purpose: 'Freelance Employee',
      claims_match: `cred_type="basic_info{first_name, last_name, date_of_birth, gender}:bvn{id_number}"`,
      issuer_match: organizationDID,
      manual_verification: true,
    };

    const response = await ezrahCredential.createVerificationModel(params);
    expect(response?.id).toBeDefined();
    expect(response?.title).toBeDefined();
    expect(response?.purpose).toBe('Freelance Employee');
    expect(response?.manual_verification).toBe(true);
    expect(response?.title).toBe('Employee Freelancing');
  });

  it('Ceate Auth Verification Model', async () => {
    const params: CreateAuthVerificationModel = {
      title: 'Login with Dojah for Cowrywise',
      purpose: 'Looking to login with dojah',
      claims_match: 'first_name,last_name',
      issuer_match: 'did:ezrah:0x67d4c289860E1B64a63805f944db4b214a0cA06a',
      manual_verification: false,
      client_id: `random_client_id_5-${Math.random()}`,
      client_secret: 'uuid_4_client_secret_here_2',
      callback: 'https://creds-oauth-relying-party-demo.web.app',
      custom_url_scheme: 'string',
      oob_prefix: 'oauth.ezrah.co',
      session_duration: '140000',
    };

    console.log('Auth verification mode creation');

    const response = await ezrahCredential.createAuthVerificationModel(params);
    console.log(response);
    expect(response?.title).toBeDefined();
    expect(response?.claims_match).toBeDefined();
    expect(response?.client_id).toBeDefined();
    // expect(response?.purpose).toBe('Freelance Employee');
    // expect(response?.manual_verification).toBe(true);
    // expect(response?.title).toBe('Employee Freelancing');
  });

  it('Create Request Message', async () => {
    const params: CreateRequestMediatorMessage = {
      source: 'Cowrywise wants to login',
      oob_code: 'ejY2df9f3bf389d89b82b38d2b',
      message: 'Login with partner',
      session_code: 'request_mediator_session_code',
      reciever_did: 'did:ezrah:0x67d4c289860E1B64a63805f944db4b214a0cA06a',
    };
    console.log('Request mediator mode creation');

    const response = await ezrahCredential.createRequestMessage(params);
    console.log(response);
    expect(response).toBeTruthy();
  });

  it.skip('Add Webhook - One', async () => {
    const params: CreateCredentialsWebhook = {
      request_key: organizationAPIKey,
      name: 'Webhook 1',
      webhook_url: 'https://example.com/hour/at/hand',
    };

    const response = await ezrahCredential.addCredentialsWebhook(params);

    expect(response?.id).toBeDefined();
    expect(response?.name).toBeDefined();

    webhookID = response?.id ?? '';

    expect(webhookID).toBeDefined();
  });

  it.skip('Add Webhook - Two', async () => {
    const params: CreateCredentialsWebhook = {
      request_key: organizationAPIKey,
      name: 'Airline REaltime',
      webhook_url: 'https://example.com/realtime/airline',
    };

    const response = await ezrahCredential.addCredentialsWebhook(params);

    expect(response?.id).toBeDefined();
    expect(response?.name).toBeDefined();
  });

  it.skip('Add Webhook - Three', async () => {
    const params: CreateCredentialsWebhook = {
      request_key: organizationAPIKey,
      name: 'Webhook Resting',
      webhook_url: 'https://example.com/ajfx/Testing',
    };

    const response = await ezrahCredential.addCredentialsWebhook(params);

    expect(response?.id).toBeDefined();
    expect(response?.name).toBeDefined();
  });

  it.skip('Update Webhook - One ', async () => {
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

  it.skip('Delete Webhook - One ', async () => {
    const response = await ezrahCredential.deleteCredentialWebhook(webhookID);

    expect(typeof response).toBe('boolean');
    expect(response).toBe(true);
  });

  it.skip('List Issued Credentials', async () => {
    const response = await ezrahCredential.issuedCredentials();

    expect(typeof response).toBe('object');
    expect(typeof response?.credentials).toBe('object');
    expect(typeof response?.total_count).toBe('number');
    expect(typeof response?.size).toBe('number');
    expect(response?.credentials.length).toBeGreaterThan(0);
  });

  it.skip('List Issued Credentials With Filter', async () => {
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

  it.skip('Credential Analytics', async () => {
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

  it.skip('List Verification Models', async () => {
    const response = await ezrahCredential.verificationModels();

    expect(response?.length).toBeGreaterThan(0);
    expect(typeof response).toBe('object');
    expect(typeof response?.[0].title).toBe('string');
    expect(typeof response?.[0].manual_verification).toBe('boolean');

    verificationModelID = response?.[0].id ?? '';
    expect(verificationModelID).toBeDefined();
  });

  it.skip('Verification Request', async () => {
    const response = await ezrahCredential.verificationRequests(verificationModelID);

    expect(typeof response)?.toBe('object');
  });

  it.skip('List Webhooks', async () => {
    const response = await ezrahCredential.webhooks();
    console.log(response);
    expect(typeof response).toBe('object');
    expect(response?.length).toBeGreaterThan(0);
    expect(typeof response?.[0].id).toBe('string');
    expect(typeof response?.[0].name).toBe('string');
    expect(typeof response?.[0].webhook_url).toBe('string');
  });
});
