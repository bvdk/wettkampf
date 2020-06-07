"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nexus_1 = require("nexus");
exports.default = () => {
    nexus_1.schema.objectType({
        name: 'OfficialSlot',
        definition(t) {
            t.model.id();
            t.model.createdAt();
            t.model.updatedAt();
            t.model.position();
            t.model.official();
            t.model.officialId();
            t.model.slot();
            t.model.slotId();
        },
    });
};
