import { registerEnumType } from "type-graphql";


export enum Discipline {
    BENCHPRESS = "BENCHPRESS",
    SQUAT = "SQUAT",
    DEADLIFT = "DEADLIFT",
    POWERLIFTING = "POWERLIFTING",
}

registerEnumType(Discipline, {
    name: "Discipline",
});
