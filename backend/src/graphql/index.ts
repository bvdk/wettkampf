import path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import AgeClasses from "./resolvers/AgeClasses";
import AthleteResolver from "./resolvers/Athlete";
import AthleteGroupResolver from "./resolvers/AthleteGroup";
import AthleteGroupsResolver from "./resolvers/AthleteGroups";
import AthletesResolver from "./resolvers/Athletes";
import AttemptResolver from "./resolvers/Attempt";
import AttemptsResolver from "./resolvers/Attempts";
import EventResolver from "./resolvers/Event";
import EventsResolver from "./resolvers/Events";
import OfficialResolver from "./resolvers/Official";
import OfficialsResolver from "./resolvers/Officials";
import OfficialSlotResolver from "./resolvers/OfficialSlot";
import OfficialSlotsResolver from "./resolvers/OfficialSlots";
import ResultClassResolver from "./resolvers/ResultClass";
import SlotResolver from "./resolvers/Slot";
import SlotsResolver from "./resolvers/Slots";
import SystemsResolver from "./resolvers/Systems";
import WeightClass from "./resolvers/WeightClass";
import WeightClasses from "./resolvers/WeightClasses";

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
    OfficialSlotsResolver,
    OfficialSlotResolver,
    ResultClassResolver,
    SystemsResolver
  ]
});

export default schema;
