jest.mock('graphl-request', () => {
  const mClient = {
    request: jest.fn(),
  };

  return {
    GraphQLClient: jest.fn(() => mClient),
    gql: jest.fn((strings) => strings),
  }
})