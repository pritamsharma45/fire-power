import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  floatArg,
} from "nexus";
// OrderItem model
// model OrderItem {
//     id           Int      @id @default(autoincrement())
//     quantity     Int
//     price        Float
//     createdAt    DateTime @default(now())
//     updatedAt    DateTime @updatedAt
//     // Relationships
//     order        Order    @relation(fields: [orderId], references: [id])
//     product      Product  @relation(fields: [productId], references: [id])
//     orderId      Int
//     productId    Int
//   }

export const OrderItem = objectType({
  name: "OrderItem",
  definition(t) {
    t.int("id");
    t.int("quantity");
    t.float("price");
    t.string("createdAt");
    t.string("updatedAt");
    t.field("order", { type: "Order" });
    t.field("product", { type: "Product" });
  },
});
