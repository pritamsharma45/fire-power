import { ApolloServer } from "apollo-server-micro";
import { schema } from "../../graphql/schema";
import { createContext } from "../../graphql/context";

import Cors from "micro-cors";
export const apolloServer = new ApolloServer({
  schema,
  context: createContext,
});

const startServer = apolloServer.start();

// Responsible for setting up the CORS headers, HTTP request methods, and the path for the GraphQL endpoint
// Check for CORS
export default async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  
  await new Promise(resolve => setTimeout(resolve, 300));

  // Responsible for handling the request and response
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
};
export const config = {
  api: {
    bodyParser: false,
  },
};
