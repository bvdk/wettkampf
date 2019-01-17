import {FieldResolver, Query, Resolver, ResolverInterface, Root} from "type-graphql";
import {AthleteGroup} from "../models/athleteGroup";

@Resolver((of) => AthleteGroup)
export default class AthleteGroupResolver implements ResolverInterface<AthleteGroup> {


}
