import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { COOKIE_NAME, __prod__ } from './constants';
// import { Post } from './entities/post';
import microConfig  from './mikro-orm.config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
// import { User } from './entities/User';
import { createConnection } from 'typeorm';



const main = async () => {
    const orm = await MikroORM.init(microConfig);
    // await orm.em.nativeDelete(User, {});
    await orm.getMigrator().up();

    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis();

    const origins = ['https://studio.apollographql.com', 'http://localhost:3000']
    app.use(cors({
        origin: origins,
        credentials: true
    }));

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis as any,
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
        context: ({res, req}) => ({ em: orm.em, req, res, redis })
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app, cors: false });

    app.get('/', (_, res) => {
        res.send("hello");
    });
    app.listen(4000,  () => {
        console.log('server started on localhost:4000');
    });
};

main();

