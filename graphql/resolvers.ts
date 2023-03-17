
import {prisma} from "../lib/prisma";


export const resolvers = {
  Query: {
    products: async () => await prisma.product.findMany(),
  }
}

