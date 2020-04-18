import lodashId from "lodash-id";
import low from "lowdb";
import path from "path";
import CustomAsyncAdapter from "./CustomAsyncAdapter";
import AgeClassesSeed from "./seed/ageClasses";
import UsersSeed from "./seed/users";
import WeightClassesSeed from "./seed/weightClasses";

const adapter = new CustomAsyncAdapter(
  path.join(process.env.DB || __dirname, ".", "db.json")
);
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
  users: "users",
  weightClasses: "weightClasses"
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
  [CollectionKeys.users]: UsersSeed
}).write();

db._.mixin(lodashId);

export default db;
