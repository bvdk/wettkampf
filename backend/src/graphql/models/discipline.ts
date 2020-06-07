import { registerEnumType } from "type-graphql";

export enum Discipline {
  BENCHPRESS = "BENCHPRESS",
  SQUAT = "SQUAT",
  DEADLIFT = "DEADLIFT",
  POWERLIFTING = "POWERLIFTING"
}

export const ShortDisciplines = {
  [Discipline.SQUAT]: "KB",
  [Discipline.BENCHPRESS]: "BD",
  [Discipline.DEADLIFT]: "KH"
};

registerEnumType(Discipline, {
  name: "Discipline"
});
