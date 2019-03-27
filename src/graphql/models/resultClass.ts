import {Field, ID, ObjectType} from "type-graphql";
import {Gender} from "./gender";
import {WeightClass} from "./weightClass";
import {AgeClass} from "./ageClass";

@ObjectType()
export class ResultClass {

    @Field((type) => ID)
    public id: string;

    @Field({nullable: true})
    public name?: string;

    @Field({nullable: true})
    public ageClassId?: string;

    @Field(type => AgeClass, {nullable: true})
    public ageClass?: AgeClass;

    @Field({nullable: true})
    public weightClassId?: string;

    @Field(type => WeightClass, {nullable: true})
    public weightClass?: WeightClass;

    @Field((type) => Gender, {nullable: true})
    public gender?: Gender;

    @Field((type) => Boolean, {nullable: true})
    public raw?: boolean;

}
