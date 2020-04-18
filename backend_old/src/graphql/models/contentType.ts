import { registerEnumType } from "type-graphql";

export enum ContestType {
  SINGLE = "SINGLE",
  TEAM = "TEAM"
}

registerEnumType(ContestType, {
  name: "ContestType"
});
