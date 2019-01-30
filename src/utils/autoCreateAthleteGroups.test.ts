import "reflect-metadata";
import {Athlete} from "../graphql/models/athlete";
import {AthleteGroupCreationKey} from "../graphql/models/athleteGroupCreationResult";
import athletesMock from "./../../tmp/mocks/athletes";
import createAutoCreateAthleteGroups from "./autoCreateAthleteGroups";
import ageClassesMock from "../../tmp/mocks/ageClasses";
import weightClassesMock from "../../tmp/mocks/weightClasses";


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

        console.log(result);

        expect(result.length).toBe(6);
        expect(result[0].name).toEqual("Männer");
        expect(result[1].name).toEqual("Frauen");

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

});
