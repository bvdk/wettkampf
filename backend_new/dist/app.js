"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nexus_1 = require("nexus");
const nexus_plugin_prisma_1 = require("nexus-plugin-prisma");
// import { PrismaClient } from 'nexus-plugin-prisma/client'
const nexus_plugin_jwt_auth_1 = require("nexus-plugin-jwt-auth");
const graphql_1 = require("./graphql");
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});
// const db = new PrismaClient()
const run = () => {
    try {
        nexus_1.use(nexus_plugin_prisma_1.prisma());
        // Enables the JWT Auth plugin without permissions
        nexus_1.use(nexus_plugin_jwt_auth_1.auth({
            appSecret: '123456',
        }));
        graphql_1.default();
        // const ageClassUpsertPromises = ageClasses.map((ageClass) =>
        //   db.ageClass
        //     .upsert({
        //       where: { id: ageClass.id },
        //       create: ageClass,
        //       update: ageClass,
        //     })
        //     .then((e) => e),
        // )
        //
        // const weightClassUpsertPromises = weightClasses.map((weightClass) =>
        //   db.weightClass
        //     .upsert({
        //       where: { id: weightClass.id },
        //       create: weightClass,
        //       update: weightClass,
        //     })
        //     .then((e) => e),
        // )
        //
        // await Promise.all(ageClassUpsertPromises)
        // await Promise.all(weightClassUpsertPromises)
        const path = '/api/graphql';
        nexus_1.settings.change({
            server: {
                path,
                startMessage: (data) => console.log(data),
                playground: true,
            },
            schema: {
                generateGraphQLSDLFile: './schema.graphql',
            },
        });
        // if (app.settings.current.server.playground) {
        //   let playgroundHandler: (req: any, res: any) => void | undefined
        //   function getPlaygroundHandler() {
        //     if (playgroundHandler) return playgroundHandler
        //
        //     playgroundHandler = app.server.express._router.stack.find(
        //       (e: any) => e.route?.path === '/' && e.route?.methods.get,
        //     )?.handle
        //     return playgroundHandler
        //   }
        //
        //   app.server.express.get(`${path}/playground`, (req, res, next) => {
        //     const handler = getPlaygroundHandler()
        //     if (handler) return handler(req, res)
        //     next() // handler is not instantly available, next() if not found
        //   })
        // }
    }
    catch (e) {
        console.error('Error:', e);
    }
};
run();
