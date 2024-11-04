import { PrismaClient } from "@prisma/client";
import { getUserLoader } from "./user-loader.js";
import { getMemberTypeLoader } from "./member-type-loader.js";

export const getRootDataLoader = (prisma: PrismaClient) => {
  return {
    userLoader: getUserLoader(prisma),
    memberTypeLoader: getMemberTypeLoader(prisma)
  }
}