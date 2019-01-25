import {FieldResolver, Resolver, ResolverInterface, Root} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import { Athlete } from "../models/athlete";
import {AthleteGroup} from "../models/athleteGroup";
import {Attempt} from "../models/attempt";

@Resolver((of) => Athlete)
export default class AthleteResolver implements ResolverInterface<Athlete> {

    @FieldResolver()
    public athleteGroup(@Root() athlete: Athlete) {
        return CrudAdapter.getItem(AthleteGroup.collectionKey, athlete.athleteGroupId);
    }


    @FieldResolver()
    public attempts(@Root() athlete: Athlete) {
        return CrudAdapter.filter(Attempt.collectionKey, { athleteId: athlete.id });
    }

}
