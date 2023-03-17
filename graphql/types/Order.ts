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
    t.field("items", { type: "OrderItem" });
    t.field("user", { type: "User" });
    t.field("transactions", { type: "PaymentTransaction" });
  },
});

// Fetch Orders for a user
// export const createOrder = extendType({
//   type: "Mutation",
//   definition(t) {
//     t.field("createOrder", {
//       type: "Order",
//       args: {
//         total: nonNull(floatArg()),
//         items: nonNull(
//           list(
//             nonNull(
//               inputObjectType({
//                 name: "OrderItemInput",
//                 definition(t) {
//                   t.nonNull.int("quantity");
//                   t.nonNull.float("price");
//                   t.nonNull.int("productId");
//                 },
//               })
//             )
//           )
//         ),
//         userId: nonNull(stringArg()),
//       },
//       resolve: async (_, { total, items, userId }, ctx) => {
//         const orderItems = items.map((item) => ({
//           quantity: item.quantity,
//           price: item.price,
//           product: { connect: { id: item.productId } },
//         }));

//         const order = await ctx.prisma.order.create({
//           data: {
//             total,
//             user: { connect: { id: userId } },
//             items: { create: orderItems },

//           },
//         });

//         return order;
//       },
//     });
//   },
// });

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
          }
          
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
        payment: nonNull(
          inputObjectType({
            name: "PaymentTransactionInput",
            definition(t) {
              t.nonNull.float("amount");
              t.nonNull.string("status");
            },
          })
        ),
      },
      resolve: async (_, { total, items, userId, payment }, ctx) => {
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

        const order = await ctx.prisma.order.update({
          where: { id: paymentTransaction.orderId },
          data: {
            items: { create: orderItems },
            userId: userId,
          },
        });

        return order;
      },
    });
  },
});
