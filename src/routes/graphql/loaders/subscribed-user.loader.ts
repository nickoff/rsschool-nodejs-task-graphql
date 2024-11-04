import { PrismaClient, User } from "@prisma/client";
import DataLoader from "dataloader";

type UserWithSubscriptions = User & { subscribedToUser: { subscriber: User }[] };
type UserWithAuthors = User & { userSubscribedTo: { author: User }[] };

const getSubscribedUsers = (
  usersWithSubscriptions: UserWithSubscriptions[],
  ids: readonly string[],
) => {

  const mapSubscriptionsByUser = usersWithSubscriptions.reduce<Record<string, UserWithSubscriptions[]>>((prev, curr) => {
    const groupKey = curr.id;
    const group = prev[groupKey] || [];
    group.push(curr);
    return { ...prev, [groupKey]: group };
  }, {});

  return ids.map(
    (id) =>
      mapSubscriptionsByUser[id]?.flatMap((user) => user.subscribedToUser.map((sub) => sub.subscriber)) ?? [],
  );
};

const getSubscribtionAuthors = (
  subscribedUsers: UserWithAuthors[],
  ids: readonly string[],
) => {

  const mapSubscriptionsByUser = subscribedUsers.reduce<Record<string, UserWithAuthors[]>>((prev, curr) => {
    const groupKey = curr.id;
    const group = prev[groupKey] || [];
    group.push(curr);
    return { ...prev, [groupKey]: group };
  }, {});

  return ids.map(
    (id) => mapSubscriptionsByUser[id]?.flatMap((user) => user.userSubscribedTo.map((item) => item.author)) ?? [],
  );
};

export const getSubscribedToUserLoader = (prisma: PrismaClient) => {
  const dataloader = new DataLoader(async (ids: readonly string[]) => {
    const usersWithSubscriptions = await prisma.user.findMany({
      where: { id: { in: [...ids] } },
      include: { subscribedToUser: { select: { subscriber: true } } },
    });
    
    return getSubscribedUsers(usersWithSubscriptions, ids);
  })

  return dataloader;
}

export const getUserSubscribedToLoader = (prisma: PrismaClient) => {
  const dataloader = new DataLoader(async (ids: readonly string[]) => {
    const subscribedUsers = await prisma.user.findMany({
      where: { id: { in: [...ids] } },
      include: { userSubscribedTo: { select: { author: true } } },
    });
    
    return getSubscribtionAuthors(subscribedUsers, ids);
  })

  return dataloader;
}