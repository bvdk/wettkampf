import {FieldResolver, Resolver, ResolverInterface, Root} from "type-graphql";
import {WeightClass} from "../models/weightClass";
import {Gender} from "../models/gender";
import * as _ from "lodash";

@Resolver((of) => WeightClass)
export default class WeightClassResolver implements ResolverInterface<WeightClass> {

    @FieldResolver()
    public name(@Root() weightClass: WeightClass) {
        return `${weightClass.gender === Gender.MALE ? 'Männer' : weightClass.gender === Gender.FEMALE ? 'Frauen' : ''} ${_.get(weightClass, "name", "")}`;
    }

}
