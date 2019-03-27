import _ from "lodash";
import {FieldResolver, Resolver, ResolverInterface, Root} from "type-graphql";
import {getDescriptionForGender} from "../models/gender";
import {ResultClass} from "../models/resultClass";
import AgeClassesResolver from "./AgeClasses";
import WeightClassesResolver from "./WeightClasses";
import {Athlete} from "../models/athlete";
import {CrudAdapter} from "../../database/CrudAdapter";
import {AgeClass} from "../models/ageClass";
import {WeightClass} from "../models/weightClass";

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

    @FieldResolver()
    public ageClass(@Root() resultClass: ResultClass) {
        if (resultClass.ageClassId) {
            return CrudAdapter.getItem(AgeClass.collectionKey, resultClass.ageClassId );
        }
        return null;
    }

    @FieldResolver()
    public weightClass(@Root() resultClass: ResultClass) {
        if (resultClass.weightClassId) {
            return CrudAdapter.getItem(WeightClass.collectionKey, resultClass.weightClassId );
        }
        return null;
    }

}
