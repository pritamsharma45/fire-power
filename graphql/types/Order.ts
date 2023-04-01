import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  floatArg,
  list,
  inputObjectType,
} from "nexus";

export const Order = objectType({
  name: "Order",
  definition(t) {
    t.int("id");
    t.string("createdAt");
    t.string("updatedAt");
    t.string("sessionId");
    t.field("items", { type: "OrderItem" });
    t.field("user", { type: "User" });
    t.field("transactions", { type: "PaymentTransaction" });
  },
});

//  Fetch all orderItems for a user
export const orderItems = extendType({
  type: "Query",
  definition(t) {
    t.list.field("orderItems", {
      type: "OrderItem",
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: async (_, { userId }, ctx) => {
        const orderItems = await ctx.prisma.orderItem.findMany({
          where: {
            order: {
              user: {
                id: userId,
              },
            },
          },
          include: {
            product: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return orderItems;
      },
    });
  },
});

// Create a new order with two order items and a payment transaction

export const createOrder = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createOrder", {
      type: "Order",
      args: {
        items: nonNull(
          list(
            nonNull(
              inputObjectType({
                name: "OrderItemInput",
                definition(t) {
                  t.nonNull.int("quantity");
                  t.nonNull.int("productId");
                  t.nonNull.float("price");
                },
              })
            )
          )
        ),
        userId: nonNull(stringArg()),
        sessionId: nonNull(stringArg()),
        payment: nonNull(
          inputObjectType({
            name: "PaymentTransactionInput",
            definition(t) {
              t.nonNull.float("amount");
              t.nonNull.string("status");
            },
          })
        ),
        shippingAddress: nonNull(
          inputObjectType({
            name: "ShippingAddressInput",
            definition(t) {
              t.nonNull.string("name");
              t.nonNull.string("line1");
              t.nonNull.string("line2");
              t.nonNull.string("city");
              t.nonNull.string("state");
              t.nonNull.string("country");
              t.nonNull.string("postal_code");
            },
          })
        ),
      },
      resolve: async (
        _,
        { total, items, userId, sessionId, payment, shippingAddress },
        ctx
      ) => {
        //  check if order exist with the same session id

        const orderExist = await ctx.prisma.order.findFirst({
          where: {
            sessionId: sessionId,
          },
        });
        if (orderExist) {
          return orderExist;
        }
        const orderItems = items.map((item) => ({
          quantity: item.quantity,
          price: item.price,
          product: { connect: { id: item.productId } },
        }));

        const paymentTransaction = await ctx.prisma.paymentTransaction.create({
          data: {
            amount: payment.amount,
            status: payment.status,
            userId: userId,
            // payment_intent_id: payment.payment_intent_id,
            order: { create: { user: { connect: { id: userId } } } },
          },
        });

        const shippingAddressCreation = await ctx.prisma.shippingAddress.create(
          {
            data: {
              name: shippingAddress.name,
              line1: shippingAddress.line1,
              line2: shippingAddress.line2,
              city: shippingAddress.city,
              state: shippingAddress.state,
              country: shippingAddress.country,
              postal_code: shippingAddress.postal_code,
              order: { create: { user: { connect: { id: userId } } } },
            },
          }
        );

        const order = await ctx.prisma.order.update({
          where: { id: paymentTransaction.orderId },
          data: {
            items: { create: orderItems },
            userId: userId,
            sessionId: sessionId,
          },
        });

        return order;
      },
    });
  },
});
