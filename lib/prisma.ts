// // /lib/prisma.ts
// import { PrismaClient } from '@prisma/client';

// // PrismaClient is attached to the `global` object in development to prevent
// // exhausting your database connection limit.
// // Learn more: https://pris.ly/d/help/next-js-best-practices

// let prisma: PrismaClient;

// if (process.env.NODE_ENV === 'production') {
//   prisma = new PrismaClient();
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
//   prisma = global.prisma;
// }
// export default prisma;

import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development
declare const global: NodeJS.Global & { prisma?: PrismaClient };

export const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;
