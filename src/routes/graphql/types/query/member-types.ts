import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { MemberType } from "@prisma/client";
import { MemberTypeId } from "../../../member-types/schemas.js";
import { Context } from "../context.type.js";
import { profileType } from "./profile.js";

export const memberEnumTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: MemberTypeId.BASIC },
    BUSINESS: { value: MemberTypeId.BUSINESS },
  },
})

export const memberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(memberEnumTypeId) },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
    profiles: {
      type: new GraphQLList(profileType),
      resolve: async (obj: MemberType, _args, context: Context) => {
        return await context.prisma.profile.findMany({ where: { memberTypeId: obj.id } })
      }
    }
  })
})

export const memberQueryType = {
  memberType: {
    type: memberType as GraphQLObjectType,
    args: {
      id: { type: new GraphQLNonNull(memberEnumTypeId) }
    },
    resolve: async(_obj, args: MemberType, context: Context) => {
      return await context.prisma.memberType.findUnique({ where: { id: args.id } })
    }
  },
  memberTypes: {
    type: new GraphQLList(memberType),
    resolve: async (_obj, _args, context: Context) => {
      return await context.prisma.memberType.findMany()
    }
  }
}

