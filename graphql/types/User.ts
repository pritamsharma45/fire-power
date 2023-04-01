import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  floatArg,
} from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.string("id");
    t.string("email");
    t.string("name");
    t.string("password");
    t.string("createdAt");
    t.string("updatedAt");
    t.field("comments", { type: "Comment" });
    t.field("likes", { type: "Like" });
    t.field("orders", { type: "Order" });
  },
});

export const UserWithEmail = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("userWithEmail", {
      type: User,
      args: {
        email: nonNull(stringArg()),
      },
      async resolve(parent, args, ctx) {
        const result = await ctx.prisma.user.findUnique({
          where: {
            email: args.email,
          },
        });
        return result || null;
      },
    });
  },
});
