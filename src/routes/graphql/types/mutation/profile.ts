import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UUIDType } from "../uuid.js";
import { memberEnumTypeId } from "../query/member-types.js";
import { profileType } from "../query/profile.js";
import { Context } from "../context.type.js";
import { Profile } from "@prisma/client";

interface CreateProFile {
  dto : {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
    userId: string;
  }
}

interface ChangeProFile {
  id: string,
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
  }
}

export const createProfile = new GraphQLInputObjectType ({
  name: 'CreateProfileInput',
  fields: () => ({
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(memberEnumTypeId) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) }
  }),
})

export const changeProfile = new GraphQLInputObjectType ({
  name: 'ChangeProfileInput',
  fields: () => ({
    memberTypeId: { type: memberEnumTypeId },
    yearOfBirth: { type: GraphQLInt },
    isMale: { type: GraphQLBoolean }
  }),
})

export const profileMutationType = {
  createProfile: {
    type: profileType as GraphQLObjectType,
    args: {
      dto: { type: new GraphQLNonNull(createProfile) }
    },
    resolve: async (_obj, args: CreateProFile, context: Context) => {
      return await context.prisma.profile.create({ data: args.dto })
    }
  },
  changeProfile: {
    type: profileType as GraphQLObjectType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(changeProfile) }
    },
    resolve: async (_obj, args: ChangeProFile, context: Context) => {
      return await context.prisma.profile.update({ where: { id: args.id }, data: args.dto })
    }
  },
  deleteProfile: {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: {
      id: { type: new GraphQLNonNull(UUIDType) }
    },
    resolve: async (_obj, args: Profile, context: Context) => {
      try {
        await context.prisma.profile.delete({ where: { id: args.id } })
        return true
      } catch {
        return false
      }
    }
  }
}