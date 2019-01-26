import {Field, ID, InputType, ObjectType} from "type-graphql";
import {AgeClass} from "./ageClass";
import {Gender} from "./gender";

@ObjectType()
export class WeightClass {

    public static collectionKey: string = "weightClasses";

    @Field((type) => ID)
    public id: string;

    @Field()
    public name: string;

    @Field({nullable: true})
    public gender: Gender;
}

@InputType()
export class WeightClassInput {

    @Field({nullable: true})
    public name: string;

    @Field((type) => Gender, {nullable: true})
    public gender: Gender;

}
