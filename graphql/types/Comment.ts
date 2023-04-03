import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  floatArg,
} from "nexus";

export const Comment = objectType({
  name: "Comment",
  definition(t) {
    t.int("id");
    t.string("content");
    t.string("createdAt");
    t.string("updatedAt");
    t.field("product", { type: "Product" });
    t.field("user", { type: "User" });
    t.int("productId");
    t.string("userId");
  },
});

export const AddComment = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("addComment", {
      type: Comment,
      args: {
        userId: nonNull(stringArg()),
        productId: nonNull(intArg()),
        content: nonNull(stringArg()),
      },
      async resolve(parent, args, ctx) {
        // console.log(parent);
        return await ctx.prisma.comment.create({
          // Use the create method to add a new comment to the database
          data: {
            content: args.content,
            productId: args.productId, // Assign the productId argument to the productId field
            userId: args.userId, // Replace with the actual user ID who is creating the comment
          },
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        });
      },
    });
  },
});

// Fetch all comments by productId
export const CommentsByProductId = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("commentsByProductId", {
      type: Comment,
      args: {
        productId: nonNull(intArg()),
      },
      async resolve(parent, args, ctx) {
        const results = await ctx.prisma.comment.findMany({
          where: {
            productId: args.productId,
          },
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        console.log("Comments", results);
        return results;
      },
    });
  },
});
