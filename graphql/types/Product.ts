import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  floatArg,
  nullable,
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
    t.nullable.float("mrp");

    t.string("description");
    t.nullable.string("allergies");
    // enum field
    t.string("policyType");
    t.string("image");
    t.int("stockQuantity");

    // likes which are connected to this product
    t.list.field("likes", {
      type: "Like",
      resolve(parent, args, ctx) {
        return ctx.prisma.product
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .likes();
      },
    });
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
            include: { likes: true },
            orderBy: [
              {
                rank: "asc",
              },
              {
                id: "asc",
              },
            ],
          });
        } else {
          queryResults = await ctx.prisma.product.findMany({
            take: args.first,
            include: { likes: true },
            orderBy: [
              {
                rank: "asc",
              },
              {
                id: "asc",
              },
            ],
          });
        }

        if (queryResults.length > 0) {
          const lastProductResults = queryResults[queryResults.length - 1];
          const lastProductID = lastProductResults.id;

          const secondQueryResults = await ctx.prisma.product.findMany({
            take: args.first,
            skip: 1,
            cursor: {
              id: lastProductID,
            },
            include: { likes: true },
            orderBy: [
              {
                rank: "asc",
              },
              {
                id: "asc",
              },
            ],
          });

          const result = {
            pageInfo: {
              endCursor: lastProductID,
              hasNextPage: secondQueryResults.length > 0,
              // hasNextPage: secondQueryResults.length >= args.first,
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
      async resolve(_parent, args, ctx) {
        const product = await ctx.prisma.product.findUnique({
          where: {
            id: args.id,
          },
        });

        console.log("Single Product", product);
        return product;
      },
    });
  },
});

// get 10 Products with maximum likes
export const TopProductsQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("topProducts", {
      type: "Product",
      resolve: async (_parent, args, ctx) => {
        const productsWithMaxLikes = await ctx.prisma.product.findMany({
          select: {
            id: true,
            title: true,
            description: true,
            allergies: true,
            price: true,
            mrp: true,
            image: true,
            stockQuantity: true,
            likes: {
              select: {
                hasLiked: true,
              },
            },
            _count: { select: { likes: { where: { hasLiked: true } } } },
          },
        });
        // console.log("Products with max likes", productsWithMaxLikes);
        const outputResult = productsWithMaxLikes
          .sort((a, b) => {
            return b._count.likes - a._count.likes;
          })
          .slice(0, 10);
        // console.log("Output result", outputResult);
        return outputResult;
      },
    });
  },
});

// Get products with aggregated likes. Count likes and group by product id
// export const ProductsWithAggregatedLikesQuery = extendType({
//   type: "Query",
//   definition(t) {
//     t.list.field("productsWithAggregatedLikes", {
//       type: "Product",
//       resolve(_parent, args, ctx) {
//         const productsWithLikes = ctx.prisma.product.findMany({
//           select: {
//             _count: {
//               select: { likes: true },
//             },
//           },
//         });

//         return productsWithLikes;
//       },
//     });
//   },
// });

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
