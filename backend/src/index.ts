import express from "express";
import fileUpload from "express-fileupload";
import { GraphQLServer } from "graphql-yoga";
import passport from "passport";
import path from "path";
import exportResultsCSVResolver from "./export/exportResultsCSV";
import exportResultsPdfResolver from "./export/exportResultsPdf";
import getSchema from "./graphql";
import importResolver from "./import";
import PassportJSConfig from "./passport";

const init = () => getSchema.then((schema) => {
    const server = new GraphQLServer({
      schema,
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
    }, ({ port }) => console.warn(`Server is running on http://localhost:${port}`));
  });

export default init;
