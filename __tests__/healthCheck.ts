import { gql } from "@apollo/client";
import { ApolloServer } from 'apollo-server-micro';
 import { typeDefs } from '../graphql/schema';
import { resolvers } from '../graphql/resolvers';
import { describe, expect, test } from "@jest/globals";

it('returns hello with the provided name', async () => {
  const testServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const response = await testServer.executeOperation({
    query: 'query SayHelloWorld($name: String) { hello(name: $name) }',
    variables: { name: 'world' },
  });

  console.log(response.data.hello);
  
  expect(response.data?.hello).toBe('Hello world!');
});


it('returns health test is ok', async () => {
    const testServer = new ApolloServer({
      typeDefs,
      resolvers,
    });
  
    const response = await testServer.executeOperation({
      query: gql`
      query allPersonQuery($first: Int, $after: Int) {
        people(first: $first, after: $after) {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            cursor
            node {
              address
              email
              id
              name
              phone
            }
          }
        }
      }
      `,
      variables: { "first":20,
      "after": 0 },
    });
    expect(response.data?.people.edges.length).toBe(20);

  });