import  path from "path";
import "reflect-metadata";
import {buildSchema} from "type-graphql";
import AgeClasses from "./resolvers/AgeClasses";
import AthleteResolver from "./resolvers/Athlete";
import AthleteGroupResolver from "./resolvers/AthleteGroup";
import AthleteGroupsResolver from "./resolvers/AthleteGroups";
import AthletesResolver from "./resolvers/Athletes";
import AttemptResolver from "./resolvers/Attempt";
import AttemptsResolver from "./resolvers/Attempts";
import EventResolver from "./resolvers/Event";
import EventsResolver from "./resolvers/Events";
import SlotResolver from "./resolvers/Slot";
import SlotsResolver from "./resolvers/Slots";
import OfficialsResolver from "./resolvers/Officials";
import OfficialResolver from "./resolvers/Official";
import WeightClass from "./resolvers/weightClass";
import WeightClasses from "./resolvers/WeightClasses";
import ResultClassResolver from "./resolvers/ResultClass";

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
        WeightClass,
        WeightClasses,
        AgeClasses,
        OfficialsResolver,
        OfficialResolver,
        ResultClassResolver,
    ],
});

export default schema;
