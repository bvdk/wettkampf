"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nexus_1 = require("nexus");
exports.default = () => {
    nexus_1.schema.objectType({
        name: 'Event',
        definition(t) {
            t.model.id();
            t.model.createdAt();
            t.model.updatedAt();
            t.model.name();
            t.model.discipline();
            t.model.contestType();
        },
    });
};
