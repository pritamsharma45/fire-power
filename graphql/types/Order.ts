import {
    nonNull,
    objectType,
    stringArg,
    extendType,
    intArg,
    floatArg,
  } from "nexus";
  
  // Order model
// model Order {
//     id           Int           @id @default(autoincrement())
//     total        Float
//     createdAt    DateTime      @default(now())
//     updatedAt    DateTime      @updatedAt
//     // Relationships
//     items        OrderItem[]
//     user         User          @relation(fields: [userId], references: [id])
//     transactions PaymentTransaction[]
//     userId       Int
//   }

export const Order = objectType({
    name: "Order",
    definition(t) {
        t.int("id");
        t.float("total");
        t.string("createdAt");
        t.string("updatedAt");
        t.field("items", { type: "OrderItem" });
        t.field("user", { type: "User" });
        t.field("transactions", { type: "PaymentTransaction" });
        }
    });