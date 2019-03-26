import lodashId from "lodash-id";
import low from "lowdb";
import path from "path";
import CustomAsyncAdapter from "./CustomAsyncAdapter";
import AgeClassesSeed from "./seed/ageClasses";
import WeightClassesSeed from "./seed/weightClasses";

const adapter = new CustomAsyncAdapter(path.join(__dirname, ".", "db.json"));
const db = low(adapter);

export const CollectionKeys = {
    ageClasses: "ageClasses",
    athleteGroups: "athleteGroups",
    athletes: "athletes",
    attempts: "attempts",
    events: "events",
    officialSlots: "officialSlots",
    officials: "officials",
    slots: "slots",
    weightClasses: "weightClasses",
};

db.defaults({
    [CollectionKeys.events]: [],
    [CollectionKeys.athletes]: [],
    [CollectionKeys.officials]: [],
    [CollectionKeys.slots]: [],
    [CollectionKeys.athleteGroups]: [],
    [CollectionKeys.attempts]: [],
    [CollectionKeys.weightClasses]: WeightClassesSeed,
    [CollectionKeys.ageClasses]: AgeClassesSeed,
    [CollectionKeys.officialSlots]: [],
})
    .write();


db._.mixin(lodashId);

export default db;
