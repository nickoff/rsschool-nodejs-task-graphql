import { Post, PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";

export const getUserPostLoader = (prisma: PrismaClient): DataLoader<string, Post[], string> => {
  const dataloader = new DataLoader(async (ids: readonly string[]) => {
    const posts = await prisma.post.findMany({ where: { authorId: { in: [...ids]} } });

    const mapPostsByAuthor = posts.reduce<Record<string, Post[]>>((prev, curr) => {
      const groupKey = curr.authorId;
      const group = prev[groupKey] || [];
      group.push(curr);
      return { ...prev, [groupKey]: group };
    }, {});

    return ids.map((id) => mapPostsByAuthor[id] ?? []);
  });

  return dataloader;
};
