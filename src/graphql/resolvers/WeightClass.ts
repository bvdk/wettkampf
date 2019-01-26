import {Resolver, ResolverInterface} from "type-graphql";
import {WeightClass} from "../models/weightClass";

@Resolver((of) => WeightClass)
export default class WeightClassResolver implements ResolverInterface<WeightClass> {



}
