import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  floatArg,
} from "nexus";

// PaymentTransaction model
// model PaymentTransaction {
//     id           Int      @id @default(autoincrement())
//     amount       Float
//     status       String
//     createdAt    DateTime @default(now())
//     updatedAt    DateTime @updatedAt
//     // Relationships
//     order        Order    @relation(fields: [orderId], references: [id])
//     userId       Int
//     orderId      Int
//   }
export const PaymentTransaction = objectType({
  name: "PaymentTransaction",
  definition(t) {
    t.int("id");
    t.float("amount");
    t.string("status");
    t.string("payment_intent_id");
    t.string("createdAt");
    t.string("updatedAt");
    t.field("order", { type: "Order" });
    t.int("userId");
    t.int("orderId");
  },
});
