import { GraphQLBoolean, GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { postType } from "../query/post.js";
import { UUIDType } from "../uuid.js";
import { Context } from "../context.type.js";
import { Post } from "@prisma/client";

interface CreatePost {
  dto : {
    authorId: string
    title: string
    content: string
  }
}

interface ChangePost {
  id: string,
  dto: {
    title: string
    content: string
  }
}

export const createPost = new GraphQLInputObjectType ({
  name: 'CreatePostInput',
  fields: () => ({
    authorId: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
})

export const changePost = new GraphQLInputObjectType ({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
})

export const postMutationType = {
  createPost: {
    type: postType as GraphQLObjectType,
    args: {
      dto: { type: new GraphQLNonNull(createPost) }
    },
    resolve: async (_obj, args: CreatePost, context: Context) => {
      return await context.prisma.post.create({ data: args.dto })
    }
  },
  changePost: {
    type: postType as GraphQLObjectType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(changePost) }
    },
    resolve: async (_obj, args: ChangePost, context: Context) => {
      return await context.prisma.post.update({ where: { id: args.id }, data: args.dto })
    }
  },
  deletePost: {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: {
      id: { type: new GraphQLNonNull(UUIDType) }
    },
    resolve: async (_obj, args: Post, context: Context) => {
      try {
        await context.prisma.post.delete({ where: { id: args.id } })
        return true
      } catch {
        return false
      }
    }
  }
}