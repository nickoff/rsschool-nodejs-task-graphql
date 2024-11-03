import { GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql"
import { UUIDType } from "../uuid.js"
import { Context } from "../context.type.js"
import { User } from "@prisma/client"
import { postType } from "./post.js"
import { profileType } from "./profile.js"

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (obj: User, _args, context: Context) => {
        return await context.prisma.post.findMany({ where: { authorId: obj.id } })
      }
    },
    profile: {
      type: profileType as GraphQLObjectType,
      resolve: async (obj: User, _args, context: Context) => {
        return await context.prisma.profile.findUnique({ where: { userId: obj.id } })
      }
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (obj: User, _args, context: Context) => {
        return await context.prisma.user.findMany({ where: { userSubscribedTo: { some: { authorId: obj.id } } } })
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async (obj: User, _args, context: Context) => {
        return await context.prisma.user.findMany({ where: { subscribedToUser: { some: { subscriberId: obj.id } } } })
      }
    }
  })
})

export const userQueryType = {
  user: {
    type: userType as GraphQLObjectType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_obj, args: User, context: Context) => {
      return await context.prisma.user.findUnique({ where: { id: args.id } })
    }
  },
  users: {
    type: new GraphQLList(userType),
    resolve: async (_obj, _args, context: Context) => {
      return await context.prisma.user.findMany()
    }
  }
}