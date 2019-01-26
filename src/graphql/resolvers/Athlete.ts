import * as _ from "lodash";
import {FieldResolver, Resolver, ResolverInterface, Root} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import { Athlete } from "../models/athlete";
import {AthleteGroup} from "../models/athleteGroup";
import {Attempt} from "../models/attempt";

function _calculateAge(birthday): number { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

@Resolver((of) => Athlete)
export default class AthleteResolver implements ResolverInterface<Athlete> {


    @FieldResolver()
    public firstName(@Root() athlete: Athlete) {
        return _.get(athlete, "firstName", "");
    }

    @FieldResolver()
    public lastName(@Root() athlete: Athlete) {
        return _.get(athlete, "lastName", "");
    }

    @FieldResolver()
    public age(@Root() athlete: Athlete) {
        return athlete.birthday ? _calculateAge(new Date(athlete.birthday)) : null;
    }

    @FieldResolver()
    public athleteGroup(@Root() athlete: Athlete) {
        if (athlete.athleteGroupId) {
            return CrudAdapter.getItem(AthleteGroup.collectionKey, athlete.athleteGroupId);
        }
        return null;
    }

    @FieldResolver()
    public attemptCount(@Root() athlete: Athlete) {
        return _.size(this.attempts(athlete));
    }

    @FieldResolver()
    public attempts(@Root() athlete: Athlete) {
        return CrudAdapter.filter(Attempt.collectionKey, { athleteId: athlete.id });
    }

    @FieldResolver()
    public weightClass(@Root() athlete: Athlete) {
        if (athlete.weightClassId) {
            return CrudAdapter.getItem(Attempt.collectionKey, athlete.weightClassId );
        }
        return null;
    }

}
