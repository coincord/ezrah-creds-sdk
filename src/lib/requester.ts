import dotenv from 'dotenv';
dotenv.config();

import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.EZRAH_CREDENTIAL_BASE_URL as string;
console.log('Sending request to:', endpoint);
console.log('Access key:', process.env.EZRAH_ORGANIZATION_API_KEY);

const graphqlClient = new GraphQLClient(`https://${process.env.EZRAH_CREDENTIAL_BASE_URL}`, {
  headers: {
    'Content-Type': 'application/json',
    'access-key': <string>process.env.EZRAH_ORGANIZATION_API_KEY,
  },
});

console.log('GraphlqClient initialized:', graphqlClient);


export default graphqlClient;
