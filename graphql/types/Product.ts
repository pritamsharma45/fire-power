import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  floatArg,
} from "nexus";
// import { connectionFromArraySlice, cursorToOffset,connectionDefinitions } from 'graphql-relay';

export const Edge = objectType({
  name: "Edge",
  definition(t) {
    t.nonNull.int("cursor");
    t.nonNull.field("node", { type: "Product" });
  },
});

export const PageInfo = objectType({
  name: "PageInfo",
  definition(t) {
    t.nonNull.boolean("hasNextPage");
    t.nonNull.int("endCursor");
  },
});

export const Response = objectType({
  name: "Response",
  definition(t) {
    t.nonNull.list.field("edges", { type: "Edge" });
    t.nonNull.field("pageInfo", { type: "PageInfo" });
  },
});

export const Product = objectType({
  name: "Product",
  definition(t) {
    t.int("id");
    t.string("title");
    t.float("price");
    t.string("description");
    t.string("image");
    t.int("stockQuantity");
  },
});

// get All Products
export const ProductsQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("products", {
      type: "Response",
      args: { first: intArg(), after: intArg() },
      async resolve(_, args, ctx) {
        let queryResults = null;

        if (args.after) {
          queryResults = await ctx.prisma.product.findMany({
            take: args.first,
            skip: 1,
            cursor: {
              id: args.after,
            },
          });
        } else {
          queryResults = await ctx.prisma.product.findMany({
            take: args.first,
          });
        }

        if (queryResults.length > 0) {
          const lastProductResults = queryResults[queryResults.length - 1];
          const lastProductID = lastProductResults.id;

          const secondQueryResults = await ctx.prisma.product.findMany({
            take: args.first,
            cursor: {
              id: lastProductID,
            },
          });

          const result = {
            pageInfo: {
              endCursor: lastProductID,
              hasNextPage: secondQueryResults.length >= args.first,
            },

            edges: queryResults.map((product) => ({
              cursor: product.id,
              node: product,
            })),
          };

          return result;
        } else {
          return {
            pageInfo: {
              endCursor: null,
              hasNextPage: false,
            },
            edges: [],
          };
        }
      },
    });
  },
});
// get Unique Product
export const ProductByIDQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("product", {
      type: "Product",
      args: { id: nonNull(intArg()) },
      resolve(_parent, args, ctx) {
        const product = ctx.prisma.product.findUnique({
          where: {
            id: args.id,
          },
        });
        return product;
      },
    });
  },
});

// create product
export const CreateProductMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createProduct", {
      type: Product,
      args: {
        title: nonNull(stringArg()),
        description: nonNull(stringArg()),
        price: nonNull(floatArg()),
        image: nonNull(stringArg()),
        stockQuantity: nonNull(intArg()),
      },
      async resolve(_parent, args, ctx) {
        const newProduct = {
          title: args.title,
          description: args.description,
          price: args.price,
          image: args.image,
          stockQuantity: args.stockQuantity,
        };

        return await ctx.prisma.product.create({
          data: newProduct,
        });
      },
    });
  },
});

// update Product
export const UpdateProductMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateProduct", {
      type: "Product",
      args: {
        id: intArg(),
        title: stringArg(),
        image: stringArg(),
        price: floatArg(),
        description: stringArg(),
        stockQuantity: intArg(),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.product.update({
          where: { id: args.id },
          data: {
            title: args.title,
            description: args.description,
            price: args.price,
            image: args.image,
            stockQuantity: args.stockQuantity,
          },
        });
      },
    });
  },
});

//  Update likes
// export const UpdateProductMutation = extendType({
//   type: "Mutation",
//   definition(t) {
//     t.nonNull.field("incrementLikes", {
//       type: "Product",
//       args: {
//         id: intArg(),
//       },
//       resolve(_parent, args, ctx) {
//         return ctx.prisma.product.update({
//           where: { id: args.id },
//           data: {
//             likes: {

//             }
//           },
//         });
//       },
//     });
//   },
// });

// // delete Product
export const DeleteProductMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteProduct", {
      type: "Product",
      args: {
        id: nonNull(intArg()),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.product.delete({
          where: { id: args.id },
        });
      },
    });
  },
});
