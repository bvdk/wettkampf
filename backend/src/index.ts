import fileUpload from "express-fileupload";
import _ from "lodash";
import express from "express";
import path from "path";
import { GraphQLServer } from "graphql-yoga";
import passport from "src/passport";
import getSchema from "./graphql";
import importResolver from "./import";
import exportResultsPdfResolver from "./export/exportResultsPdf";
import exportResultsCSVResolver from "./export/exportResultsCSV";
import PassportJSConfig from "./passport";

const init = () => {

  return getSchema.then((schema) => {

    // @ts-ignore
    const server = new GraphQLServer({
      schema
    });

    PassportJSConfig.init(server.express);
    server.use(fileUpload());
    server.post("/import/:eventId", importResolver);
    server.get("/export/:eventId/pdf", exportResultsPdfResolver);
    server.get("/export/:eventId/csv", exportResultsCSVResolver);
    server.get("/test", (req, res) => res.json({success: true}));
    server.get("/authTest", passport.authenticate(["jwt"], {session: false}), (req, res) => res.json({success: true}));
    server.use(express.static(path.resolve(__dirname, ".", "client")));

    return server.start({
      endpoint: "/graphql",
      playground: "/playground",
      port: 4000,
    },({ port }) => console.log(`Server is running on http://localhost:${port}`))
        .catch((error) => console.error(error));

  });




};

export default init;
