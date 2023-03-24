import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  floatArg,
} from "nexus";

export const ShippingAddress = objectType({
  name: "ShippingAddress",
  definition(t) {
    t.int("id");
    t.string("createdAt");
    t.string("name");
    t.string("line1");
    t.string("line2");
    t.string("city");
    t.string("state");
    t.string("country");
    t.string("postal_code");
    t.field("order", { type: "Order" });
  },
});

export const createShippingAddress = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createShippingAddress", {
      type: "ShippingAddress",
      args: {
        name: nonNull(stringArg()),
        line1: nonNull(stringArg()),
        line2: stringArg(),
        city: nonNull(stringArg()),
        state: nonNull(stringArg()),
        country: nonNull(stringArg()),
        postal_code: nonNull(stringArg()),
        orderId: nonNull(intArg()),
      },
      resolve: async (
        _,
        { name, line1, line2, city, state, country, postal_code, orderId },
        ctx
      ) => {
        const shippingAddress = await ctx.prisma.shippingAddress.create({
          data: {
            name,
            line1,
            line2,
            city,
            state,
            country,
            postal_code,
            order: { connect: { id: orderId } },
          },
        });
        return shippingAddress;
      },
    });
  },
});
