import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UUIDType } from "../uuid.js";
import { Profile } from "@prisma/client";
import { Context } from "../context.type.js";
import { memberEnumTypeId, memberType } from "./member-types.js";
import { userType } from "./user.js";

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: memberEnumTypeId },
    user: {
      type: userType as GraphQLObjectType,
      resolve: async (obj: Profile, _args, context: Context) => {
        return await context.prisma.user.findUnique({ where: { id: obj.userId } })
      }
    },
    memberType: {
      type: memberType as GraphQLObjectType,
      resolve: async (obj: Profile, _args, context: Context) => {
        return await context.prisma.memberType.findUnique({ where: { id: obj.memberTypeId } })
      }
    }
  })
})

export const profileQueryType = {
  profile: {
    type: profileType as GraphQLObjectType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_obj, args: Profile, context: Context) => {
      return await context.prisma.profile.findUnique({ where: { id: args.id } })
    }
  },
  profiles: {
    type: new GraphQLList(profileType),
    resolve: async (_obj, _args, context: Context) => {
      return await context.prisma.profile.findMany()
    }
  },
}