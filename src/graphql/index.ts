import * as path from "path";
import "reflect-metadata";
import {buildSchema} from "type-graphql";
import AthleteResolver from "./resolvers/Athlete";
import AthleteGroupResolver from "./resolvers/AthleteGroup";
import AthleteGroupsResolver from "./resolvers/AthleteGroups";
import AthletesResolver from "./resolvers/Athletes";
import EventResolver from "./resolvers/Event";
import EventsResolver from "./resolvers/Events";
import SlotResolver from "./resolvers/Slot";
import SlotsResolver from "./resolvers/Slots";
import AttemptsResolver from "./resolvers/Attempts";
import AttemptResolver from "./resolvers/Attempt";


// @ts-ignore
const schema = buildSchema({
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    resolvers: [
        EventsResolver,
        EventResolver,
        AthletesResolver,
        AthleteGroupResolver,
        AthleteGroupsResolver,
        SlotsResolver,
        SlotResolver,
        AthleteResolver,
        AttemptsResolver,
        AttemptResolver,
    ],
});

export default schema;
