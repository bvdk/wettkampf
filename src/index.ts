import { GraphQLServer } from "graphql-yoga";
import db from "./database";
import getSchema from "./graphql";

const init = () => {

  console.log("Starting ...");

  return getSchema.then((schema) => {

    // @ts-ignore
    const server = new GraphQLServer({
      schema,
    });

    return server.start(() => console.log("Server is running on http://localhost:4000"))
        .catch((error) => console.error(error));

  });




};

export default init;
