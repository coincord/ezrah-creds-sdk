import {request, GraphQLClient} from "graphql-request";


const graphqlClient = new GraphQLClient(`https://${process.env.EZRAH_CREDENTIAL_BASE_URL}/graphl`, {
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "access-key": <string>process.env.EZRAH_ORGANIZATION_API_KEY
  },
});


export default graphqlClient;