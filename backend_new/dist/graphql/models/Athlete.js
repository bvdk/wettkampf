"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nexus_1 = require("nexus");
exports.default = () => {
    nexus_1.schema.objectType({
        name: 'Athlete',
        definition(t) {
            t.model.id();
            t.model.createdAt();
            t.model.updatedAt();
            t.model.raw();
            t.model.athleteNumber();
            t.model.firstName();
            t.model.lastName();
            t.model.gender();
            t.model.club();
            t.model.birthday();
            t.model.total();
            t.model.norm();
            t.model.lateRegistration();
            t.model.price();
            t.model.bodyWeight();
            t.model.wilks();
            t.model.dots();
            t.model.los();
            t.model.KB1();
            t.model.KB2();
            t.model.KB3();
            t.model.BD1();
            t.model.BD2();
            t.model.BD3();
            t.model.KH1();
            t.model.KH2();
            t.model.KH3();
            t.model.points();
            t.model.place();
            t.model.location();
            t.model.nextAttemptsSortKeys();
            t.model.importId();
            t.model.event();
            t.model.eventId();
            t.model.weightClass();
            t.model.weightClassId();
            t.model.ageClass();
            t.model.ageClassId();
            t.model.resultClassId();
        },
    });
};
