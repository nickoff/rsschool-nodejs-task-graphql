import { GraphQLBoolean, GraphQLFloat, GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { userType } from "../query/user.js";
import { Context } from "../context.type.js";
import { User } from "@prisma/client";
import { UUIDType } from "../uuid.js";

interface CreateUser{
  dto : {
    balance: number;
    name: string;
  }
}

interface ChangeUser {
  id: string,
  dto: {
    balance: number;
    name: string;
  }
}

export const createUser = new GraphQLInputObjectType ({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
})

export const changeUser = new GraphQLInputObjectType ({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
})

export const userMutationType = {
  createUser: {
    type: userType as GraphQLObjectType,
    args: {
      dto: { type: new GraphQLNonNull(createUser) },
    },
    resolve: async (_obj, args: CreateUser, context: Context) => {
      return await context.prisma.user.create({ data: args.dto })
    }
  },
  changeUser: {
    type: userType as GraphQLObjectType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(changeUser) },
    },
    resolve: async (_obj, args: ChangeUser, context: Context) => {
      return await context.prisma.user.update({ where: { id: args.id }, data: args.dto })
    }
  },
  deleteUser: {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: {
      id: { type: new GraphQLNonNull(UUIDType) }
    },
    resolve: async (_obj, args: User, context: Context) => {
      try {
        await context.prisma.user.delete({ where: { id: args.id } })
        return true
      } catch {
        return false
      }
    }
  } 
}