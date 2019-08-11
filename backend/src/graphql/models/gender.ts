import {registerEnumType} from "type-graphql";
import {Discipline} from "./discipline";

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
}

export function getDescriptionForGender(gender: Gender) {
    switch (gender) {
        case Gender.MALE: return "Männer";
        case Gender.FEMALE: return "Frauen";
    }
}

registerEnumType(Gender, {
    name: "Gender",
});
