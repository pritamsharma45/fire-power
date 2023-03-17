import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  floatArg,
} from "nexus";

export const WholesaleProducts = objectType({
  name: "WholesaleProducts",
  definition(t) {
    t.int("id");
    t.int("minQty");
    t.float("discount");
    t.string("createdAt");
    t.int("productId");
    t.field("product", { type: "Product" });
  },
});

//  Fetch all wholesale products

export const WholesaleProductsQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("wholesaleProducts", {
      type: "WholesaleProducts",
      resolve(parent, args, ctx) {
        return ctx.prisma.wholesaleProducts.findMany({
          include: {
            product: true,
          },
        });
      },
    });
  },
});
