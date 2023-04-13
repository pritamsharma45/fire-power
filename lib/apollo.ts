import { ApolloClient, InMemoryCache } from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";

const devUrl = "http://localhost:3000/api/graphql";
const prodUrl = "https://nextjs-ecommerce-ten-delta.vercel.app/api/graphql";
// const prodUrl = `https://${process.env.VERCEL_URL}/api/graphql`;
const url = process.env.NODE_ENV === "production" ? prodUrl : devUrl;

export const client = new ApolloClient({
  uri: url,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          people: relayStylePagination(),
        },
      },
    },
  }),
});
