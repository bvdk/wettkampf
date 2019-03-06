import {Field, ID, ObjectType} from "type-graphql";

@ObjectType()
export class ResultClass {
    @Field((type) => ID)
    public id: string;

    @Field({nullable: true})
    public name?: string;

}
