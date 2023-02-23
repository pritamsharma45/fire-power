
import {prisma} from "../lib/prisma";


export const resolvers = {
  Query: {
    products: async () => await prisma.product.findMany(),
  }
}



// import * as casual from "casual";

// export const resolvers = {
//   Query: {
//     people: (_, args, context) => {
//       let arr = [];
//       for (let i = 0; i < 2000; i++) {
//         const generatedId = casual.uuid;
//         arr.push({
//           cursor: i,
//           node: {
//             id: generatedId,
//             name: casual.name,
//             address: casual.address,
//             email: casual.email,
//             phone: casual.phone,
//           },
//         });
//       }
//       let hasNext = true;
//       let end = args.first;

//       if (!args.after) {
//         arr = arr.slice(0, args.first);
//       } else {
//         if (args.after + args.first > arr.length) {
//           hasNext = false;
//           arr = arr.slice(args.after, arr.length);
//           end = arr.length - 1;
//         } else {
//           arr = arr.slice(args.after, args.after + args.first);
//           end = args.after + args.first;
//         }
//       }

//       const res = {
//         edges: arr,
//         pageInfo: {
//           hasNextPage: hasNext,
//           endCursor: end,
//         },
//       };

//       return res;
//     },
//     hello: (_, { name }) => `Hello ${name}!`,
//   },
// };
