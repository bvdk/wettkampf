"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nexus_1 = require("nexus");
exports.default = () => {
    nexus_1.schema.objectType({
        name: 'AthleteGroup',
        definition(t) {
            t.model.id();
            t.model.createdAt();
            t.model.updatedAt();
            t.model.name();
            t.model.event();
            t.model.eventId();
            t.model.slot();
            t.model.slotId();
        },
    });
};
