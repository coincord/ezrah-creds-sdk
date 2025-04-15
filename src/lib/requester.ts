import dotenv from 'dotenv';
dotenv.config();

import { GraphQLClient } from 'graphql-request';

const graphqlClient = new GraphQLClient(
  `https://${process.env.EZRAH_CREDENTIAL_BASE_URL}/credentials/graphql`,
  {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'node',
      'access-key': `Bearer ${<string>process.env.EZRAH_ORGANIZATION_API_KEY}`,
    },
  },
);

export default graphqlClient;
