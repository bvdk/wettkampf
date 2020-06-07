import app from 'nexus'
import { prisma } from 'nexus-plugin-prisma'
// import { PrismaClient } from 'nexus-plugin-prisma/client'
import { auth } from 'nexus-plugin-jwt-auth'
import ageClasses from './mocks/ageClasses'
import weightClasses from './mocks/weightClasses'
import createSchema from './graphql'

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason)
  // Application specific logging, throwing an error, or other logic here
})

// const db = new PrismaClient()

const run = () => {
  try {
    app.use(prisma())

    // Enables the JWT Auth plugin without permissions
    app.use(
      auth({
        appSecret: '123456',
      }),
    )

    createSchema()

    const path = '/api/graphql'
    app.settings.change({
      server: {
        path,
        startMessage: (data) => console.log(data),
        playground: { path: `${path}/playground` },
      },
      schema: {
        generateGraphQLSDLFile: './schema.graphql',
      },
    })

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
  } catch (e) {
    console.error('Error:', e)
  }
}

run()
