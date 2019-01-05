import {Field, ID, ObjectType} from "type-graphql";

@ObjectType()
export class AgeClass {

    public static collectionKey: string = "ageClasses";

    @Field((type) => ID)
    public id: string;

    @Field()
    public name: string;
}
