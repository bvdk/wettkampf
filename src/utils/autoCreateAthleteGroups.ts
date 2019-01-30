import * as _ from "lodash";
import {AgeClass} from "../graphql/models/ageClass";
import {Athlete} from "../graphql/models/athlete";
import {AthleteGroup} from "../graphql/models/athleteGroup";
import {AthleteGroupCreationKey} from "../graphql/models/athleteGroupCreationResult";
import {Gender, getDescriptionForGender} from "../graphql/models/gender";
import {Slot} from "../graphql/models/slot";
import {WeightClass} from "../graphql/models/weightClass";

interface ICreateAutoCreateAthleteGroupsArgs {
    ageClasses: AgeClass[];
    athletes: Athlete[];
    athleteGroups: AthleteGroup[];
    slots?: Slot[];
    keys: AthleteGroupCreationKey[];
    maxGroupSize?: number;
    weightClasses: WeightClass[];
}

interface IGroupDefinition {
    gender?: string;
    ageClassId?: string;
    weightClassId?: string;
    index: string;
    name: string;
}

interface INameForKeyArgs {
    athlete: Athlete;
    ageClasses: AgeClass[];
    weightClasses: WeightClass[];
}


const nameForKey: {[s: string]: (item: INameForKeyArgs) => string } = {
    [AthleteGroupCreationKey.GENDER]: (item: INameForKeyArgs) => {
        return getDescriptionForGender(item.athlete.gender);
    },
    [AthleteGroupCreationKey.WEIGHT_CLASS]: (item: INameForKeyArgs) => {
        return _.chain(item.weightClasses)
            .find({
                id: _.get(item.athlete, "weightClassId"),
            })
            .get("name")
            .value();
    },
    [AthleteGroupCreationKey.AGE_CLASS]: (item: INameForKeyArgs) => {
        return _.chain(item.ageClasses)
            .find({
                id: _.get(item.athlete, "ageClassId"),
            })
            .get("name")
            .value();
    },
};

function chunk(arr, len) {

    const chunks = [];
    let i = 0;
    const n = arr.length;

    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }

    return chunks;
}


function getGroupDefinitionIndex(keys: AthleteGroupCreationKey[], athlete: Athlete): string {
    const index = keys.map((key) => {
        return _.get(athlete, key);
    })
        .filter((item) => item)
        .join(" - ");
    return index;
}

function getGroupDefinitionName(keys: AthleteGroupCreationKey[], args: INameForKeyArgs): string {
    const index = keys.map((key) => {
        const translator = nameForKey[key];
        if (translator) {
            return translator(args);
        }
        return null;
    })
        .filter((item) => item)
        .join(" - ");
    return index;
}



export default function createAutoCreateAthleteGroups({
                                                          ageClasses,
                                                          athletes,
                                                          athleteGroups,
                                                          keys,
                                                          maxGroupSize,
                                                          weightClasses,
                                                      }: ICreateAutoCreateAthleteGroupsArgs): AthleteGroup[] {

    const groups = _.chain(athletes)
        .groupBy((athlete) => getGroupDefinitionIndex(keys, athlete) )
        .value();

    return _.chain(Object.keys(groups))
        .map((groupKey: string) => {
            const groupConfig = {
                athletes: groups[groupKey],
                index: groupKey,
                name: getGroupDefinitionName(keys, {
                    ageClasses,
                    athlete: _.first(groups[groupKey]),
                    weightClasses,
                }),
            };

            const result = [];
            if (maxGroupSize) {
                const chunks = chunk(groupConfig.athletes, maxGroupSize);
                chunks.forEach((items) => {
                    result.push({
                        ...groupConfig,
                        athletes: items,
                    });
                });

            } else {
                result.push(groupConfig);
            }

            return result;

        })
        .flatten()
        .value();
}
