import app from 'nexus'
import { prisma } from 'nexus-plugin-prisma'
import createSchema from './graphql'

const run = () => {
  try {
    // Enables the Prisma plugin
    app.use(prisma())

    createSchema()

    const path = '/api/graphql'
    app.settings.change({
      server: {
        path,
        startMessage: (data) => console.log(data),
        playground: true,
      },
      schema: {
        generateGraphQLSDLFile: './schema.graphql',
      },
    })

    if (app.settings.current.server.playground) {
      let playgroundHandler: (req: any, res: any) => void | undefined
      function getPlaygroundHandler() {
        if (playgroundHandler) return playgroundHandler

        playgroundHandler = app.server.express._router.stack.find(
          (e: any) => e.route?.path === '/' && e.route?.methods.get,
        )?.handle
        return playgroundHandler
      }

      app.server.express.get(`${path}/playground`, (req, res, next) => {
        const handler = getPlaygroundHandler()
        if (handler) return handler(req, res)
        next() // handler is not instantly available, next() if not found
      })
    }

    app.server.start()
  } catch (e) {
    console.error('Error:', e)
  }
}

run()
