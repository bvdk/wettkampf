"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nexus_1 = require("nexus");
exports.default = () => {
    nexus_1.schema.objectType({
        name: 'Official',
        definition(t) {
            t.model.id();
            t.model.createdAt();
            t.model.updatedAt();
            t.model.officalNumber();
            t.model.lastName();
            t.model.firstName();
            t.model.club();
            t.model.license();
            t.model.position();
            t.model.location();
            t.model.importId();
            t.model.event();
            t.model.eventId();
        },
    });
};
