import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql, parse, validate } from 'graphql';
import { queryRootType } from './types/query/root-query.js';
import { mutationRootType } from './types/mutation/root-mutation.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },

    async handler(req) {
      const schema = new GraphQLSchema({query: queryRootType, mutation: mutationRootType});
      const source = req.body.query;
      const variableValues = req.body.variables;
      const contextValue = {prisma: fastify.prisma};
      const validateErrors = validate(schema, parse(source));

      if (validateErrors.length) {
        return {errors: validateErrors};
      }

      const response = await graphql({
        schema,
        source,
        variableValues,
        contextValue,
      })
  
      return response;
    },
  });
};

export default plugin;
