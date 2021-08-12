import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from 'path';
import { User } from "./entities/User";



export default { // returns promise, so we await
    migrations:{
        path: path.join(__dirname,'./migrations'), // path to the folder with migrations
        pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
    },
    entities: [Post,User], // All our db tables
    dbName: 'lireddit',
    type: 'postgresql',
    debug: !__prod__
} as Parameters<typeof MikroORM.init>[0]; // getting type that init expects
