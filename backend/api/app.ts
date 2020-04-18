import app from 'nexus'
import { prisma } from 'nexus-plugin-prisma'
import createSchema from './graphql'

const run = () => {
  try {
    // Enables the Prisma plugin
    app.use(prisma())

    createSchema()

    app.settings.change({
      server: {
        startMessage: (data) => console.log(data),
        playground: true,
        path: '/api/graphql',
      },
      schema: {
        generateGraphQLSDLFile: './schema.graphql',
      },
    })

    app.server.start()
  } catch (e) {
    console.error('Error:', e)
  }
}

run()
