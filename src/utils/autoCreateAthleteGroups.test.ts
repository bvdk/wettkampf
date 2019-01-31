import "reflect-metadata";
import ageClassesMock from "../../tmp/mocks/ageClasses";
import weightClassesMock from "../../tmp/mocks/weightClasses";
import {Athlete} from "../graphql/models/athlete";
import {AthleteGroupCreationKey} from "../graphql/models/athleteGroupCreationResult";
import {Gender} from "../graphql/models/gender";
import athletesMock from "./../../tmp/mocks/athletes";
import createAutoCreateAthleteGroups, {findAthleteGroupByKeyConfig} from "./autoCreateAthleteGroups";


describe("Auto create athlete groups", () => {
    test("Should create gender groups", () => {

        const result = createAutoCreateAthleteGroups({
            ageClasses: ageClassesMock,
            athleteGroups: [],
            athletes: athletesMock as Athlete[],
            keys: [AthleteGroupCreationKey.GENDER],
            maxGroupSize: 0,
            slots: [],
            weightClasses: weightClassesMock,
        });

        expect(result.length).toBe(2);
        expect(result[0].name).toEqual("Männer");
        expect(result[1].name).toEqual("Frauen");

    });

    test("Should create gender groups with max size", () => {

        const result = createAutoCreateAthleteGroups({
            ageClasses: ageClassesMock,
            athleteGroups: [],
            athletes: athletesMock as Athlete[],
            keys: [AthleteGroupCreationKey.GENDER],
            maxGroupSize: 3,
            slots: [],
            weightClasses: weightClassesMock,
        });

        expect(result.length).toBe(6);
        expect(result[0].name).toEqual("Männer");
        expect(result[5].name).toEqual("Frauen");

    });


    test("Should create weight class groups", () => {

        const result = createAutoCreateAthleteGroups({
            ageClasses: ageClassesMock,
            athleteGroups: [],
            athletes: athletesMock as Athlete[],
            keys: [AthleteGroupCreationKey.WEIGHT_CLASS],
            maxGroupSize: 0,
            slots: [],
            weightClasses: weightClassesMock,
        });

        expect(result.length).toBe(4);
        expect(result[0].name).toEqual("bis 74 Kg");
        expect(result[1].name).toEqual("bis 72 Kg");
        expect(result[2].name).toEqual("bis 52 Kg");

    });

    test("Should create age class groups", () => {

        const result = createAutoCreateAthleteGroups({
            ageClasses: ageClassesMock,
            athleteGroups: [],
            athletes: athletesMock as Athlete[],
            keys: [AthleteGroupCreationKey.AGE_CLASS],
            maxGroupSize: 0,
            slots: [],
            weightClasses: weightClassesMock,
        });

        expect(result.length).toBe(3);
        expect(result[0].name).toEqual("Aktive");
        expect(result[1].name).toEqual("außer Konkurrenz");

    });

    test("Should create gender and age class groups", () => {

        const result = createAutoCreateAthleteGroups({
            ageClasses: ageClassesMock,
            athleteGroups: [],
            athletes: athletesMock as Athlete[],
            keys: [AthleteGroupCreationKey.GENDER, AthleteGroupCreationKey.AGE_CLASS],
            maxGroupSize: 0,
            slots: [],
            weightClasses: weightClassesMock,
        });

        expect(result.length).toBe(4);
        expect(result[0].name).toEqual("Männer - Aktive");
        expect(result[1].name).toEqual("Frauen - Aktive");
        expect(result[2].name).toEqual("Frauen - außer Konkurrenz");

    });

    test("Should create gender and weight class groups", () => {

        const result = createAutoCreateAthleteGroups({
            ageClasses: ageClassesMock,
            athleteGroups: [],
            athletes: athletesMock as Athlete[],
            keys: [AthleteGroupCreationKey.GENDER, AthleteGroupCreationKey.WEIGHT_CLASS],
            maxGroupSize: 0,
            slots: [],
            weightClasses: weightClassesMock,
        });

        expect(result.length).toBe(4);
        expect(result[0].name).toEqual("Männer - bis 74 Kg");
        expect(result[1].name).toEqual("Frauen - bis 72 Kg");
        expect(result[2].name).toEqual("Frauen - bis 52 Kg");

    });


    test("Should create gender, age and weight class groups", () => {

        const result = createAutoCreateAthleteGroups({
            ageClasses: ageClassesMock,
            athleteGroups: [],
            athletes: athletesMock as Athlete[],
            keys: [AthleteGroupCreationKey.GENDER, AthleteGroupCreationKey.AGE_CLASS, AthleteGroupCreationKey.WEIGHT_CLASS],
            maxGroupSize: 0,
            slots: [],
            weightClasses: weightClassesMock,
        });

        expect(result.length).toBe(4);
        expect(result[0].name).toEqual("Männer - Aktive - bis 74 Kg");
        expect(result[0].athletes.length).toBe(2);
        expect(result[1].name).toEqual("Frauen - Aktive - bis 72 Kg");
        expect(result[2].name).toEqual("Frauen - außer Konkurrenz - bis 52 Kg");


    });


    test("Should find athlete group by config", () => {

        const result = findAthleteGroupByKeyConfig([{
            ageClassId: null,
            athleteCount: 0,
            athletes: [],
            eventId: "any",
            gender: Gender.MALE,
            id: "provided",
            name: "Meine Männer",
            slotId: null,
            weightClassId: null,
        }], {
            gender: Gender.MALE,
        });

        expect(result.length).toBe(1);

    });


    test("Should filter athlete group by config", () => {

        const groups = Array.apply(null, Array(3)).map(item => ({
            ageClassId: null,
            athleteCount: 0,
            athletes: [],
            eventId: "any",
            gender: Gender.MALE,
            id: "provided",
            name: "Meine Männer",
            slotId: null,
            weightClassId: null,
        }));
        groups.push({
            ageClassId: "ak",
            athleteCount: 0,
            athletes: [],
            eventId: "any",
            gender: Gender.MALE,
            id: "provided",
            name: "Meine Männer",
            slotId: null,
            weightClassId: null,
        });

        const result = findAthleteGroupByKeyConfig(groups, {
            gender: Gender.MALE,
        });

        expect(result.length).toBe(3);

    });

    test("Should use provided gender athlete group", () => {

        const result = createAutoCreateAthleteGroups({
            ageClasses: ageClassesMock,
            athleteGroups: [{
                ageClassId: null,
                athleteCount: 0,
                athletes: [],
                eventId: "any",
                gender: Gender.MALE,
                id: "provided",
                name: "Meine Männer",
                slotId: null,
                weightClassId: null,
            }],
            athletes: athletesMock as Athlete[],
            keys: [AthleteGroupCreationKey.GENDER],
            maxGroupSize: 0,
            slots: [],
            weightClasses: weightClassesMock,
        });

        expect(result.length).toBe(2);
        expect(result[0].id).toEqual("provided");
        expect(result[0].name).toEqual("Meine Männer");
        expect(result[1].name).toEqual("Frauen");

    });


    test("Should use provided gender athlete groups", () => {

        const result = createAutoCreateAthleteGroups({
            ageClasses: ageClassesMock,
            athleteGroups: [{
                ageClassId: null,
                athleteCount: 0,
                athletes: [],
                eventId: "any",
                gender: Gender.MALE,
                id: "provided",
                name: "Meine Männer",
                slotId: null,
                weightClassId: null,
            }, {
                ageClassId: null,
                athleteCount: 0,
                athletes: [],
                eventId: "any",
                gender: Gender.MALE,
                id: "provided2",
                name: "Männer 2",
                slotId: null,
                weightClassId: null,
            }],
            athletes: athletesMock as Athlete[],
            keys: [AthleteGroupCreationKey.GENDER],
            maxGroupSize: 5,
            slots: [],
            weightClasses: weightClassesMock,
        });

        expect(result[0].id).toEqual("provided");
        expect(result[0].name).toEqual("Meine Männer");
        expect(result[1].id).toEqual("provided2");
        expect(result[1].name).toEqual("Männer 2");

    });


    test("Should use provided gender and age class athlete group", () => {

        const result = createAutoCreateAthleteGroups({
            ageClasses: ageClassesMock,
            athleteGroups: [{
                ageClassId: "aktive",
                athleteCount: 0,
                athletes: [],
                eventId: "any",
                gender: Gender.MALE,
                id: "provided",
                name: "Meine Männer",
                slotId: null,
                weightClassId: null,
            }],
            athletes: athletesMock as Athlete[],
            keys: [AthleteGroupCreationKey.GENDER, AthleteGroupCreationKey.AGE_CLASS],
            maxGroupSize: 0,
            slots: [],
            weightClasses: weightClassesMock,
        });

        expect(result[0].id).toEqual("provided");
        expect(result[1].id === "provided").toBeFalsy();
        expect(result[2].id === "provided").toBeFalsy();
        expect(result[3].id === "provided").toBeFalsy();

    });

});
