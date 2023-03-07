import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  floatArg,
  booleanArg,
} from "nexus";

export const Like = objectType({
  name: "Like",
  definition(t) {
    t.int("id");
    t.boolean("hasLiked");
    t.string("createdAt");
    t.string("updatedAt");
    t.field("product", { type: "Product" });
    t.field("user", { type: "User" });
    t.int("productId");
    t.string("userId");
  },
});

export const UpdateLike = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("addOrUpdateLike", {
      type: Like,
      args: {
        productId: nonNull(intArg()),
        hasLiked: nonNull(booleanArg()),
        userId: nonNull(stringArg()),
      },
      async resolve(parent, args, ctx) {
        console.log(parent);
        return await ctx.prisma.like.upsert({
          where: {
            productId_userId: {
              productId: args.productId,
              userId: args.userId,
            },
          },
          update: {
            hasLiked: args.hasLiked,
          },
          create: {
            hasLiked: args.hasLiked,
            productId: args.productId,
            userId: args.userId,
          },
          include: {
            product: true // Include the product information in the response
          }
          
        });
      },
    });
  },
});

//  Fetch like by unique productId_userId
export const LikeByProductId = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("likeByProductId", {
      type: Like,
      args: {
        productId: nonNull(intArg()),
        userId: nonNull(stringArg()),
      },
      async resolve(parent, args, ctx) {
        const results = await ctx.prisma.like.findMany({
          where: {
            productId: args.productId,
            userId: args.userId,
          },
        });
        return results;
      },
    });
  },
});
