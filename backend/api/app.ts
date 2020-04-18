import app from 'nexus'
import { prisma } from 'nexus-plugin-prisma'

const run = () => {
  try {
    console.log('hello world')

    // Enables the Prisma plugin
    // TODO make prisma work
    // app.use(prisma())
    console.log('hello world2')

    app.schema.queryType({
      definition(t) {
        t.field('foo', { type: 'String', resolve: () => 'bar' })
      },
    })
    console.log('hello world3')

    app.settings.change({
      server: {
        port: 4000,
        playground: true,
        path: '/api/graphql',
      },
      schema: {
        generateGraphQLSDLFile: './schema.graphql',
      },
    })
    console.log('hello world4')

    app.server.start()
    console.log('hello world5')
  } catch (e) {
    console.error('Error:', e)
  }
}

run()
