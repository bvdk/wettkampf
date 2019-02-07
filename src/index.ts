import fileUpload from "express-fileupload";
import express from "express";
import path from "path";
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
    server.use(express.static(path.resolve(__dirname, '.', 'client')));

    return server.start({
      endpoint: "/graphql",
      playground: "/playground",
      port: 4000,
    },({ port }) => console.log(`Server is running on http://localhost:${port}`))
        .catch((error) => console.error(error));

  });




};

export default init;
