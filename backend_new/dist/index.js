"use strict";
// GENERATED NEXUS START MODULE
Object.defineProperty(exports, "__esModule", { value: true });
// Run framework initialization side-effects
// Also, import the app for later use
const app = require("nexus").default;
// Last resort error handling
process.once('uncaughtException', error => {
    app.log.fatal('uncaughtException', { error: error });
    process.exit(1);
});
process.once('unhandledRejection', error => {
    app.log.fatal('unhandledRejection', { error: error });
    process.exit(1);
});
// package.json is needed for plugin auto-import system.
// On the Zeit Now platform, builds and dev copy source into
// new directory. Copying follows paths found in source. Give one here
// to package.json to make sure Zeit Now brings it along.
require('../package.json');
// Import the user's schema modules
require("./graphql/Mutation");
require("./graphql/Query");
require("./graphql/enums/ContestType");
require("./graphql/enums/Discipline");
require("./graphql/enums/Gender");
require("./graphql/enums/Position");
require("./graphql/enums/Role");
require("./graphql/index");
require("./graphql/models/AgeClass");
require("./graphql/models/Athlete");
require("./graphql/models/AthleteGroup");
require("./graphql/models/Attempt");
require("./graphql/models/Event");
require("./graphql/models/Official");
require("./graphql/models/OfficialSlot");
require("./graphql/models/Slot");
require("./graphql/models/User");
require("./graphql/models/WeightClass");
// Import the user's app module
require("./app");
app.assemble();
app.start();
