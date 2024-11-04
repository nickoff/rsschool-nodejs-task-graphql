import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library.js";
import { getRootDataLoader } from "../loaders/root.loader.js";

export type Context = {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
} & ReturnType<typeof getRootDataLoader>;
