import {Field, ID, ObjectType} from "type-graphql";
import {Gender} from "./gender";

@ObjectType()
export class ResultClass {

    @Field((type) => ID)
    public id: string;

    @Field({nullable: true})
    public name?: string;

    @Field({nullable: true})
    public ageClassId?: string;

    @Field({nullable: true})
    public weightClassId?: string;

    @Field((type) => Gender, {nullable: true})
    public gender?: Gender;

    @Field((type) => Boolean, {nullable: true})
    public raw?: boolean;

}
