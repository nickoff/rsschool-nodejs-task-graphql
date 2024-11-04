import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";

export const getUserLoader = (prisma: PrismaClient) => {
  const dataloader = new DataLoader(async (ids: readonly string[]) => {
    const users = await prisma.user.findMany({ where: { id: { in: [... ids] } } });
    const mapUsersToIdsOrder = ids.map(id => users.find(user => user.id === id));
    return mapUsersToIdsOrder;
  })

  return dataloader;
};