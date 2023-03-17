import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  floatArg,
} from "nexus";


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
