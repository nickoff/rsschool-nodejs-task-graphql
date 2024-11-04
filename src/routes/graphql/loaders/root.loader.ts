import { PrismaClient } from "@prisma/client";
import { getUserLoader } from "./user.loader.js";
import { getMemberTypeLoader } from "./member-type.loader.js";
import { getUserPostLoader } from "./user-post.loader.js";
import { getUserProfileLoader } from "./user-profile.loader.js";
import { getSubscribedToUserLoader, getUserSubscribedToLoader } from "./subscribed-user.loader.js";

export const getRootDataLoader = (prisma: PrismaClient) => {
  return {
    userLoader: getUserLoader(prisma),
    memberTypeLoader: getMemberTypeLoader(prisma),
    userPostLoader: getUserPostLoader(prisma),
    userProfileLoader: getUserProfileLoader(prisma),
    subscribedToUserLoader: getSubscribedToUserLoader(prisma),
    userSubscribedToLoader: getUserSubscribedToLoader(prisma),
  }
}