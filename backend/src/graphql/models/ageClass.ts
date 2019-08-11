import {Field, ID, InputType, ObjectType} from "type-graphql";

@ObjectType()
export class AgeClass {

    public static collectionKey: string = "ageClasses";

    @Field((type) => ID)
    public id: string;

    @Field()
    public name: string;
}

@InputType()
export class AgeClassInput {

    @Field()
    public name: string;

}
