import * as path from "path";
import "reflect-metadata";
import {buildSchema} from "type-graphql";
import AthletesResolver from "./resolvers/Athletes";
import EventResolver from "./resolvers/Event";
import EventsResolver from "./resolvers/Events";


// @ts-ignore
const schema = buildSchema({
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    resolvers: [EventsResolver, EventResolver, AthletesResolver],
});

export default schema;
