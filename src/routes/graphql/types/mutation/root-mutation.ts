import { GraphQLObjectType } from "graphql";
import { postMutationType } from "./post.js";
import { profileMutationType } from "./profile.js";
import { userMutationType } from "./user.js";

export const mutationRootType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...postMutationType,
    ...profileMutationType,
    ...userMutationType,
  })
});