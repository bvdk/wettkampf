import {registerEnumType} from "type-graphql";
import {Discipline} from "./discipline";

export enum ContestType {
    SINGLE = "SINGLE",
    TEAM = "TEAM",
}

registerEnumType(ContestType, {
    name: "ContestType",
});
