import {Field, ID, ObjectType} from "type-graphql";
import {AgeClass} from "./ageClass";
import {Gender} from "./gender";

@ObjectType()
export class WeightClass {

    public static collectionKey: string = "weightClasses";

    @Field((type) => ID)
    public id: string;

    @Field()
    public name: string;

    @Field()
    public gender: Gender;
}

