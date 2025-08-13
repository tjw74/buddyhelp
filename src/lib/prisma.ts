import { PrismaClient } from "@/generated/prisma";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma: PrismaClient = global.prismaGlobal ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prismaGlobal = prisma;


