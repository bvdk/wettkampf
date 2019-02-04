import lodashId from "lodash-id";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import {AgeClass} from "../graphql/models/ageClass";
import { Athlete } from "../graphql/models/athlete";
import {AthleteGroup} from "../graphql/models/athleteGroup";
import {Attempt} from "../graphql/models/attempt";
import {Event} from "../graphql/models/event";
import {Slot} from "../graphql/models/slot";
import {WeightClass} from "../graphql/models/weightClass";
import AgeClassesSeed from "./seed/ageClasses.json";
import WeightClassesSeed from "./seed/weightClasses.json";

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({
    [Event.collectionKey]: [],
    [Athlete.collectionKey]: [],
    [Slot.collectionKey]: [],
    [AthleteGroup.collectionKey]: [],
    [Attempt.collectionKey]: [],
    [WeightClass.collectionKey]: WeightClassesSeed,
    [AgeClass.collectionKey]: AgeClassesSeed,
})
    .write();


db._.mixin(lodashId);

export default db;
