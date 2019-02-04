import  _ from "lodash";
import {type} from "os";
import {Arg, FieldResolver, Resolver, ResolverInterface, Root} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import { Athlete } from "../models/athlete";
import {AthleteGroup} from "../models/athleteGroup";
import {Attempt} from "../models/attempt";
import {Discipline} from "../models/discipline";
import {Slot} from "../models/slot";

function _calculateAge(birthday): number { // birthday is a date
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
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
    public slot(@Root() athlete: Athlete) {
        const athleteGroup = this.athleteGroup(athlete);
        const slotId = _.get(athleteGroup, "slotId");
        if (slotId) {
            return CrudAdapter.getItem(Slot.collectionKey, slotId);
        }
        return null;
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
    public attempts(
        @Root() athlete: Athlete,
        @Arg("discipline", (type) => Discipline, {nullable: true}) discipline?: Discipline,
    ) {
        const attempts = CrudAdapter.filter(Attempt.collectionKey, { athleteId: athlete.id });
        if (discipline){
            return _.filter(attempts,{discipline});
        }
        return attempts;
    }

    @FieldResolver()
    public bestAttempt(
        @Root() athlete: Athlete,
        @Arg("discipline", (type) => Discipline, {nullable: true}) discipline?: Discipline,
    ) {
        return _.chain(this.attempts(athlete, discipline))
            .sortBy(["weight"])
            .filter({
                valid: true,
            })
            .first()
            .value();
    }

    @FieldResolver()
    public nextAttempt(
        @Root() athlete: Athlete,
        @Arg("discipline", (type) => Discipline, {nullable: true}) discipline?: Discipline,
    ) {
        return _.chain(this.attempts(athlete, discipline))
            .sortBy(["weight"])
            .filter((attempt: Attempt) => !attempt.done)
            .first()
            .value();
    }

    @FieldResolver()
    public weightClass(@Root() athlete: Athlete) {
        if (athlete.weightClassId) {
            return CrudAdapter.getItem(Attempt.collectionKey, athlete.weightClassId );
        }
        return null;
    }

}
