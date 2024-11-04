import { GraphQLObjectType } from "graphql";
import { memberQueryType } from "./member-types.js";
import { postQueryType } from "./post.js";
import { userQueryType } from "./user.js";
import { profileQueryType } from "./profile.js";

export const queryRootType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    ...memberQueryType,
    ...postQueryType,
    ...userQueryType,
    ...profileQueryType,
  }),
})