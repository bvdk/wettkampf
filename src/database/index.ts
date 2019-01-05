import * as lodashId from "lodash-id";
import * as low from "lowdb";
import * as FileSync from "lowdb/adapters/FileSync";

const adapter = new FileSync("db.json");
const db = low(adapter);

db._.mixin(lodashId);

export default db;
