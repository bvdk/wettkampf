import * as fileUpload from "express-fileupload";
import { GraphQLServer } from "graphql-yoga";
import getSchema from "./graphql";
import importResolver from "./import";

const init = () => {

  return getSchema.then((schema) => {

    // @ts-ignore
    const server = new GraphQLServer({
      schema,
    });


    server.use(fileUpload());
    server.post("/import/:eventId", importResolver);

    return server.start(() => console.log("Server is running on http://localhost:4000"))
        .catch((error) => console.error(error));

  });




};

export default init;
