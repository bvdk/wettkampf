import {registerEnumType} from "type-graphql";
import {Discipline} from "./discipline";

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
}

registerEnumType(Gender, {
    name: "Gender",
});
