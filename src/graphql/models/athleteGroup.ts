import {Field, ID, InputType, ObjectType} from "type-graphql";
import {AgeClass} from "./ageClass";
import { Athlete } from "./athlete";
import {Gender} from "./gender";
import {WeightClass} from "./weightClass";

@ObjectType()
export class AthleteGroup {

    public static collectionKey: string = "athleteGroups";

    @Field((type) => ID)
    public id: string;

    @Field()
    public slotId?: string;

    @Field()
    public name: string;

    @Field((type) => Gender, { nullable: true })
    public gender: Gender;

    @Field((type) => AgeClass, { nullable: true })
    public ageClass: AgeClass;

    @Field((type) => WeightClass, { nullable: true })
    public weightClass: WeightClass;

    @Field( (type) => Athlete )
    public athletes: Athlete[];

}


@InputType()
export class AthleteGroupInput implements Partial<AthleteGroup> {

    @Field( { nullable: true })
    public name?: string;

    @Field((type) => Gender, { nullable: true })
    public gender?: Gender;

    @Field({ nullable: true })
    public ageClassId?: string;

    @Field({ nullable: true })
    public weightClassId?: string;

}
