import { getPrismaClient } from "../lib/prisma";

export type PrismaDB = ReturnType<typeof getPrismaClient>