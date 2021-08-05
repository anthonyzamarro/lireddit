import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
// import { Post } from './entities/post';
import microConfig  from './mikro-orm.config';
import express from 'express';
var cors = require('cors');
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';




const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    app.use(
        session({
            name: 'qid',
            store: new RedisStore({
                client: redisClient, 
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                sameSite: 'lax', // csfr
                secure: __prod__ // cookie only works on https
           },
            saveUninitialized: false,
            secret: 'qwerty',
            resave: false,
        })
    );


    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({res, req}): MyContext => ({ em: orm.em, req, res })
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app });

    // var corsOptions = {
    //     origin: 'https://$studio.apollographql.com',
    //     optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204,
    //     credentials: true,
    //   }
    
    // app.options('*', cors(corsOptions));

    app.get('/', (_, res) => {
        res.send("hello");
    });
    app.listen(4000,  () => {
        console.log('server started on localhost:4000');
    });
};

main();

