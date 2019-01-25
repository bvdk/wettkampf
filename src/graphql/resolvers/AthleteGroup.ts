import {FieldResolver, Resolver, ResolverInterface, Root} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import { Athlete } from "../models/athlete";
import {AthleteGroup} from "../models/athleteGroup";

@Resolver((of) => AthleteGroup)
export default class AthleteGroupResolver implements ResolverInterface<AthleteGroup> {

    @FieldResolver()
    public athletes(@Root() athleteGroup: AthleteGroup) {
        return CrudAdapter.filter(Athlete.collectionKey, {athleteGroupId: athleteGroup.id});
    }


}
