import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core"
import { COOKIE_NAME, __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {
    ApolloServerPluginLandingPageGraphQLPlayground
  } from "apollo-server-core";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors'





const main = async () => { // create async main bcs of promises
    const orm = await MikroORM.init(microConfig); 
    await orm.getMigrator().up();

    const app = express();

    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()

    // now cors will apply to all routes
    app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      })
    );

    redisClient.on('error',function(err){
        console.log('Reddis error: ', err)
    });

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({ 
                client: redisClient,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
                httpOnly: true,
                sameSite: 'lax', // csrf
                secure: __prod__ // cookie only works in https 
            },
            saveUninitialized: false,
            secret: 'keyboard cat',
            resave: false,
        })
    )

    const apolloServer = new ApolloServer({
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground(),
          ],
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver,UserResolver],
            validate: false,
        }),
        context: ({req,res})=> ({em: orm.em, req, res}) // Special objects that are accessible to all the resolvers
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({app, cors: false}); // Create graphql endpoint

    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    })
};

main().catch((err) => {
    console.error(err);
});