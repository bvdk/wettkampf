import app from "./config/app";
import initGateway from "./config/apollo";

const run = async () => {
  const port = process.env.PORT || 4000;
  const server = await initGateway();

  server.applyMiddleware({ app, cors: false });

  app.listen({ port }, () =>
    console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
  );
};

run().catch(console.error);
