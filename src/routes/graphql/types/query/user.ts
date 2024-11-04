import { GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLResolveInfo, GraphQLString, GraphQLType } from "graphql"
import { UUIDType } from "../uuid.js"
import { Context } from "../context.type.js"
import { Post, User } from "@prisma/client"
import { postType } from "./post.js"
import { profileType } from "./profile.js"
import { parseResolveInfo, ResolveTree, simplify } from "graphql-parse-resolve-info"

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (obj: User, _args: unknown, context: Context): Promise<Post[]> => {
        const posts = await context.userPostLoader.load(obj.id)
        return posts
      }
    },
    profile: {
      type: profileType as GraphQLObjectType,
      resolve: async (obj: User, _args, context: Context) => {
        return await context.userProfileLoader.load(obj.id)
      }
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (obj: User, _args, context: Context) => {
        return await context.subscribedToUserLoader.load(obj.id)
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async (obj: User, _args, context: Context) => {
        return await context.userSubscribedToLoader.load(obj.id)
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
    resolve: async (_obj, _args, context: Context,info: GraphQLResolveInfo) => {
      const { fields } = simplify(parseResolveInfo(info) as ResolveTree, userType as GraphQLType);
      const isUserSubscribedTo = 'userSubscribedTo' in fields;
      const isSubscribedToUser = 'subscribedToUser' in fields;
      const users = await context.prisma.user.findMany({
        include: {
          subscribedToUser: isSubscribedToUser,
          userSubscribedTo: isUserSubscribedTo,
        },
      });
  
      if (isSubscribedToUser || isUserSubscribedTo) {
        const mapUsersToIdsOrder = users.reduce<Record<string, User>>((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
  
        users.forEach((user) => {
          if (isSubscribedToUser) {
            context.subscribedToUserLoader.prime(
              user.id,
              user.subscribedToUser.map((item) => mapUsersToIdsOrder[item.subscriberId]),
            );
          }
  
          if (isUserSubscribedTo) {
            context.userSubscribedToLoader.prime(
              user.id,
              user.userSubscribedTo.map((item) => mapUsersToIdsOrder[item.authorId]),
            );
          }
        });
      }
  
      return users;
    },
  }
}