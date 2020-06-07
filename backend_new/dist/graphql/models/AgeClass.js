"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nexus_1 = require("nexus");
exports.default = () => {
    nexus_1.schema.objectType({
        name: 'AgeClass',
        definition(t) {
            t.model.id();
            t.model.name();
            t.model.sortId();
        },
    });
};
