import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  floatArg,
} from "nexus";



export const Subscriber = objectType({
  name: "Subscriber",
  definition(t) {
    t.string("id");
    t.string("userId");
    t.string("createdAt");
    t.field("user", {
      type: "User",
    });
  },
});

//  Fetch all subscribers

export const SubscriberQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("subscribers", {
      type: "Subscriber",
      resolve(parent, args, ctx) {
        return ctx.prisma.subscriber.findMany({
          include: {
            user: true,
          },
        });
      },
    });
  },
});

export const IsSubscribed = extendType({
  type: "Query",
  definition(t) {
    t.field("isSubscribed", {
      type: "Boolean",
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: async (_, { userId }, ctx) => {
        const subscriber = await ctx.prisma.subscriber.findUnique({
          where: {
            userId,
          },
        });
        return subscriber !== null;
      },
    });
  },
});


//  Create a new subscriber
export const AddSubscriber = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("addSubscriber", {
      type: Subscriber,
      args: {
        userId: nonNull(stringArg()),
      },
      async resolve(parent, args, ctx) {
        return await ctx.prisma.subscriber.create({
          data: {
            userId: args.userId,
          },
        });
      },
    });
  },
});
