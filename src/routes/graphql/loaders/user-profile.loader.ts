import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";

export const getUserProfileLoader =  (prisma: PrismaClient) => {
  const dataloader = new DataLoader(async (ids: readonly string[]) => {
    const profiles = await prisma.profile.findMany({ where: { userId: { in: [...ids] } } });
    const mapProfilesToIdsOrder = ids.map(id => profiles.find(profile => profile.userId === id));
    return mapProfilesToIdsOrder;
  })

  return dataloader;
}