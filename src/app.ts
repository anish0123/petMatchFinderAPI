/* eslint-disable node/no-extraneous-import */
require('dotenv').config();
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import typeDefs from './api/schemas/index';
import resolvers from './api/resolvers/index';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import {notFound, errorHandler} from './middlewares';
import authenticate from './lib/authenticate';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {applyMiddleware} from 'graphql-middleware';
import {MyContext} from './types/MyContext';
import {createRateLimitRule} from 'graphql-rate-limit';
import {shield} from 'graphql-shield';
import {constraintDirectiveTypeDefs} from 'graphql-constraint-directive';
import {MessageResponse} from './types/MessageTypes';
import {Response, Request} from 'express';

const app = express();

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  }),
);

(async () => {
  try {
    console.log('working till rateLimi');
    const rateLimitRule = createRateLimitRule({
      identifyContext: (ctx) => {
        return ctx.userdata?._id ? ctx.userdata._id : ctx.id;
      },
    });
    const permissions = shield({
      Mutation: {
        login: rateLimitRule({max: 5, window: '10s'}),
      },
    });
    console.log('working after permission');

    const executableSchema = makeExecutableSchema({
      typeDefs: [constraintDirectiveTypeDefs, typeDefs],
      resolvers,
    });

    const schema = applyMiddleware(executableSchema, permissions);

    const server = new ApolloServer<MyContext>({
      schema,
      introspection: true,
      plugins: [
        process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageProductionDefault({
              embed: true as false,
            })
          : ApolloServerPluginLandingPageLocalDefault(),
      ],
      includeStacktraceInErrorResponses: false,
    });
    console.log('working after server introduction');
    await server.start();

    app.get('/', (_req: Request, res: Response<MessageResponse>) => {
      res.json({
        message: 'API location: graphql',
      });
    });
    console.log('working after server introduction');

    app.use(
      '/graphql',
      cors<cors.CorsRequest>(),
      express.json(),
      expressMiddleware(server, {
        context: async ({req}) => authenticate(req),
      }),
    );

    app.use(notFound);
    app.use(errorHandler);
  } catch (error) {
    console.log(error);
  }
})();

export default app;
