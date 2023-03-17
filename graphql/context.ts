import { PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma";
// import { Claims, getSession } from "@auth0/nextjs-auth0";

export type Context = {
  prisma: PrismaClient;
};

export async function createContext({ req, res }): Promise<Context> {
  return {
    prisma: prisma,
  };
}

