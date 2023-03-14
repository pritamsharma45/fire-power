import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  floatArg,
} from "nexus";

// model PromoProducts {
//     id        Int      @id @default(autoincrement())
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
//     // Relationships
//     product   Product  @relation(fields: [productId], references: [id])
//     productId Int
//   }

export const PromoProducts = objectType({
  name: "PromoProducts",
  definition(t) {
    t.int("id");
    t.string("createdAt");
    t.string("updatedAt");
    t.int("productId");
    t.field("product", { type: "Product" });
  },
});

//  Fetch all promo products

export const PromoProductsQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("promoProducts", {
      type: "PromoProducts",
      resolve(parent, args, ctx) {
        return ctx.prisma.promoProducts.findMany({
          include: {
            product: true,
          },
        });
      },
    });
  },
});
