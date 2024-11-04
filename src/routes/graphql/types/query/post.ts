import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "../uuid.js";
import { Post } from "@prisma/client";
import { Context } from "../context.type.js";
import { userType } from "./user.js";

export const postType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: new GraphQLNonNull(UUIDType) },
    author: {
      type: userType as GraphQLObjectType,
      resolve: async (obj: Post, _args, context: Context) => {
        return await context.userLoader.load(obj.authorId)
      }
    },
  })
});

export const postQueryType = {
  post: {
    type: postType as GraphQLObjectType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_obj, args: Post, context: Context) => {
      return await context.prisma.post.findUnique({ where: { id: args.id } })
    }
  },
  posts: {
    type: new GraphQLList(postType),
    resolve: async (_obj, _args, context: Context) => {
      return await context.prisma.post.findMany()
    }
  }
}