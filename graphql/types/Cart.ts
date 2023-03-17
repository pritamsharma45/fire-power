import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  scalarType,
} from "nexus";

export const Json = scalarType({
  name: "Json",
  asNexusMethod: "json",
  description:
    "The `Json` scalar type represents JSON values as specified by " +
    "[ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).",

  serialize(value) {
    return value;
  },

  parseValue(value) {
    return value;
  },

  parseLiteral(valueNode) {
    return valueNode.loc;
  },
});

export const Cart = objectType({
  name: "Cart",
  definition(t) {
    t.int("id");
    t.string("createdAt");
    t.string("updatedAt");
    t.field("user", { type: "User" });
    t.string("userId");
    t.field("items", {
      type: Json,
    });
  },
});

//  fetch cart by userId
export const CartByUserId = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("cartByUserId", {
      type: Cart,
      args: {
        userId: nonNull(stringArg()),
      },
      async resolve(parent, args, ctx) {
        const results = await ctx.prisma.cart.findUnique({
          where: {
            userId: args.userId,
          },
        });

        return results;
      },
    });
  },
});

// add item to cart
export const AddItemToCart = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("addItemToCart", {
      type: Cart,
      args: {
        userId: nonNull(stringArg()),
        productId: nonNull(intArg()),
        quantity: nonNull(intArg()),
      },
      async resolve(parent, args, ctx) {
        const cart = await ctx.prisma.cart.findUnique({
          where: {
            userId: args.userId,
          },
        });
        let items = [];
        if (cart) {
          items = cart.items;
        }
        const item = items.find((item) => item.productId === args.productId);
        if (item) {
          item.quantity += args.quantity;
        } else {
          items.push({
            productId: args.productId,
            quantity: args.quantity,
          });
        }
        if (cart) {
          return await ctx.prisma.cart.update({
            where: {
              userId: args.userId,
            },
            data: {
              items: items,
            },
          });
        } else {
          return await ctx.prisma.cart.create({
            data: {
              userId: args.userId,
              items: items,
            },
          });
        }
      },
    });
  },
});
//  add items to cart ( items will be provided as array of JSON objects)
export const AddItemsToCart = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("addItemsToCart", {
      type: Cart,
      args: {
        userId: nonNull(stringArg()),
        items: nonNull(Json),
      },
      async resolve(parent, args, ctx) {
        const cart = await ctx.prisma.cart.findUnique({
          where: {
            userId: args.userId,
          },
        });
        let items = [];
        if (cart) {
          items = cart.items;
        }
        args.items.forEach((item) => {
          const cartItem = items.find(
            (cartItem) => cartItem.productId === item.productId
          );
          if (cartItem) {
            cartItem.quantity += item.quantity;
          } else {
            items.push({
              id: item.productId,
              quantity: item.quantity,
              title: item.title,
              price: item.price,
              image: item.image,
              description: item.description,
            });
          }
        });
        if (cart) {
          return await ctx.prisma.cart.update({
            where: {
              userId: args.userId,
            },
            data: {
              items: items,
            },
          });
        } else {
          return await ctx.prisma.cart.create({
            data: {
              userId: args.userId,
              items: items,
            },
          });
        }
      },
    });
  },
});

// Delete item from cart by productId
export const DeleteItemFromCart = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteItemFromCart", {
      type: Cart,
      args: {
        userId: nonNull(stringArg()),
        productId: nonNull(intArg()),
      },
      async resolve(parent, args, ctx) {
        const cart = await ctx.prisma.cart.findUnique({
          where: {
            userId: args.userId,
          },
        });
        if (cart) {
          const items = cart.items.filter((item) => item.id !== args.productId);
          return await ctx.prisma.cart.update({
            where: {
              userId: args.userId,
            },
            data: {
              items: items,
            },
          });
        } else {
          return null;
        }
      },
    });
  },
});

//  Update item quantity in cart

export const UpdateItemQuantityInCart = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateItemQuantityInCart", {
      type: Cart,
      args: {
        userId: nonNull(stringArg()),
        productId: nonNull(intArg()),
        quantity: nonNull(intArg()),
      },
      async resolve(parent, args, ctx) {
        const cart = await ctx.prisma.cart.findUnique({
          where: {
            userId: args.userId,
          },
        });
        if (cart) {
          const items = cart.items.map((item) => {
            if (item.id === args.productId) {
              item.quantity = args.quantity;
            }
            return item;
          });
          return await ctx.prisma.cart.update({
            where: {
              userId: args.userId,
            },
            data: {
              items: items,
            },
          });
        } else {
          return null;
        }
      },
    });
  },
});

// Delete cart by userId
export const DeleteCartByUserId = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteCartByUserId", {
      type: Cart,
      args: {
        userId: nonNull(stringArg()),
      },
      async resolve(parent, args, ctx) {
        return await ctx.prisma.cart.delete({
          where: {
            userId: args.userId,
          },
        });
      },
    });
  },
});
