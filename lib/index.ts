require("dotenv").config();
import { GraphQLClient } from "graphql-request";
import graphqlClient from "./requester";


class EzrahCredential {
  private client: GraphQLClient;

  constructor() {
    this.client = graphqlClient;
  }

  public getClient(): GraphQLClient {
    return this.client;
  }

  
}