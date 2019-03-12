import _ from "lodash";
import {FieldResolver, Resolver, ResolverInterface, Root} from "type-graphql";
import {getDescriptionForGender} from "../models/gender";
import {ResultClass} from "../models/resultClass";
import AgeClassesResolver from "./AgeClasses";
import WeightClassesResolver from "./WeightClasses";

@Resolver((of) => ResultClass)
export default class ResultClassResolver implements ResolverInterface<ResultClass> {

    @FieldResolver()
    public name(@Root() resultClass: ResultClass) {

        const ageClassesResolver = new AgeClassesResolver();
        const weightClassesResolver = new WeightClassesResolver();

        const nameComponents = [];

        if (resultClass.gender) {
            nameComponents.push(getDescriptionForGender(resultClass.gender));
        }

        if (resultClass.ageClassId) {
            nameComponents.push(_.get(ageClassesResolver.ageClass({id: resultClass.ageClassId}), "name"));
        }

        if (resultClass.weightClassId) {
            nameComponents.push(_.get(weightClassesResolver.weightClass({id: resultClass.weightClassId}), "name"));
        }


        return nameComponents.join(" - ");
    }


}
