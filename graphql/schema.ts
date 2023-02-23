
import { makeSchema, connectionPlugin } from 'nexus'
import { join } from "path";
import * as types from "./types";

export const schema = makeSchema({
  types,
  plugins: [
    connectionPlugin(),
  ],
  outputs: {
    typegen: join(
      process.cwd(),
      "node_modules","@types","nexus-typegen","index.d.ts"
    ),
    schema: join(process.cwd(), "graphql", "schema.graphql"),
  },
  contextType: {
    export: "Context",
    module: join(process.cwd(), "graphql", "context.ts"),
  },
});




// import {gql} from 'apollo-server-micro';

// export const typeDefs = gql`
//   type Person {
//     id: ID!
//     name: String
//     address: String
//     email: String
//     phone: String
//   }
//   type Edge {
//     cursor: Int
//     node: Person
//   }
//   type Response {
//     edges: [Edge]
//     pageInfo: PageInfo
//   }
//   type PageInfo {
//     hasNextPage: Boolean
//     endCursor: Int
//   }
//   type Query {
//     people(first: Int,after: Int): Response!
//   }
//   type Query {
//     hello(name: String): String!
//   }
// `;