"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nexus_1 = require("nexus");
exports.default = () => {
    nexus_1.schema.enumType({
        name: 'Discipline',
        members: ['POWERLIFTING', 'SQUAT', 'BENCHPRESS', 'DEADLIFT'],
    });
};
