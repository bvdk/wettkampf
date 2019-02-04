import {Field, ObjectType, registerEnumType} from "type-graphql";
import {Athlete} from "./athlete";
import {AthleteGroup} from "./athleteGroup";

export enum AthleteGroupCreationKey {
    GENDER = "gender",
    AGE_CLASS = "ageClassId",
    WEIGHT_CLASS = "weightClassId",
}

export function getDescriptionForKeys(key: AthleteGroupCreationKey) {
    switch (key) {
        case AthleteGroupCreationKey.GENDER: return "Geschlecht";
        case AthleteGroupCreationKey.AGE_CLASS: return "Alterklasse";
        case AthleteGroupCreationKey.WEIGHT_CLASS: return "Gewichtsklasse";
    }
}

registerEnumType(AthleteGroupCreationKey, {
    name: "AthleteGroupCreationKey",
});


@ObjectType()
export class AthleteGroupCreationResult {

    @Field((type) => AthleteGroupCreationKey, {nullable: true})
    public keys: AthleteGroupCreationKey[];

    @Field((type) => [Athlete])
    public athletes: Athlete[];

    @Field((type) => [AthleteGroup])
    public athleteGroups: AthleteGroup[];

}

