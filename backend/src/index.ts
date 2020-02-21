import express from "express";
import fileUpload from "express-fileupload";
import { GraphQLServer } from "graphql-yoga";
import passport from "passport";
import path from "path";
import exportResultsCSVResolver from "./export/exportResultsCSV";
import exportResultsPdfResolver from "./export/exportResultsPdf";
import getSchema from "./graphql";
import getPubSub from "./graphql/getPubSub";
import importResolver from "./import";
import PassportJSConfig from "./passport";

const init = () =>
  getSchema.then(schema => {
    const pubSub = getPubSub();
    const server = new GraphQLServer({
      schema,
      context: { pubSub }
    });

    PassportJSConfig.init(server.express);

    server.use(express.static(path.join(__dirname, "public")));
    server.use(fileUpload());
    server.post("/api/import/:eventId", importResolver);
    server.get("/api/export/:eventId/pdf", exportResultsPdfResolver);
    server.get("/api/export/:eventId/csv", exportResultsCSVResolver);
    server.get("/api/test", (req, res) => res.json({ success: true }));
    server.get(
      "/api/authTest",
      passport.authenticate(["jwt"], { session: false }),
      (req, res) => res.json({ success: true })
    );
    server.get("*", (req, res) => {
      res.sendFile(path.join(__dirname + "/public/index.html"));
    });

    return server.start(
      {
        endpoint: "/api/graphql",
        subscriptions: "/api",
        playground: "/api/playground",
        port: 4000
      },
      ({ port }) =>
        console.warn(`Server is running on http://localhost:${port}`)
    );
  });

export default init;
