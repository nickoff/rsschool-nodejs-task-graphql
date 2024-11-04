import { PrismaClient } from "@prisma/client";
import { getUserLoader } from "./userLoader.js";

export const getRootDataLoader = (prisma: PrismaClient) => {
  return {
    userLoader: getUserLoader(prisma)
  }
}