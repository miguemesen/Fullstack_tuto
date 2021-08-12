import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from 'express';

const main = async () => { // create async main bcs of promises
    const orm = await MikroORM.init(microConfig); 
    await orm.getMigrator().up();

    const app = express();

    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    })
};

main().catch((err) => {
    console.error(err);
});