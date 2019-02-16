import lodashId from "lodash-id";
import low from "lowdb";
import CustomAsyncAdapter from "./CustomAsyncAdapter";
import path from "path";
import {AgeClass} from "../graphql/models/ageClass";
import { Athlete } from "../graphql/models/athlete";
import {AthleteGroup} from "../graphql/models/athleteGroup";
import {Attempt} from "../graphql/models/attempt";
import {Event} from "../graphql/models/event";
import {Slot} from "../graphql/models/slot";
import {WeightClass} from "../graphql/models/weightClass";
import AgeClassesSeed from "./seed/ageClasses";
import WeightClassesSeed from "./seed/weightClasses";

const adapter = new CustomAsyncAdapter(path.join(__dirname, ".", "db.json"));
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
