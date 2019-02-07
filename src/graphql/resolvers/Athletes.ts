import {Context} from "graphql-yoga/dist/types";
import _ from "lodash";
import {Arg, Args, ArgsType, Ctx, Field, ID, Mutation, Query, Resolver} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import wilks from "../../utils/wilks";
import { Athlete, AthleteInput, AthleteUpdateInput} from "../models/athlete";
import IdArgs from "./args/IdArgs";

@ArgsType()
class CreateAthleteArgs {
    @Field((type) => ID)
    public eventId: string;

    @Field((type) => AthleteInput)
    public data: AthleteInput;
}


@ArgsType()
class FindAthleteArgs {
    @Field((type) => ID)
    public importId: string;

}


@Resolver()
export default class AthletesResolver {

    private collectionKey: string = Athlete.collectionKey;

    @Query((returns) => [Athlete] )
    public athletes(): Athlete[] {
        return CrudAdapter.getAll(this.collectionKey);
    }

    @Query((returns) => Athlete)
    public athlete(
        @Args() {id}: IdArgs,
    ): Athlete {
        return CrudAdapter.getItem(this.collectionKey, id);
    }

    @Query((returns) => Athlete)
    public findAthlete(
        @Args() args: FindAthleteArgs,
    ): Athlete {
        return CrudAdapter.find(this.collectionKey, args);
    }

    @Mutation()
    public createAthlete(
        @Args() {data, eventId}: CreateAthleteArgs,
        @Ctx() ctx: Context,
    ): Athlete {
        const athlete = CrudAdapter.insertItem(this.collectionKey, {
            ...data,
            eventId,
        });

        this.autoUpdateWilks(athlete.id, athlete);

        return athlete;
    }

    @Mutation()
    public updateAthlete(

        @Args() {id}: IdArgs,
        @Arg("data") data: AthleteUpdateInput,
        @Ctx() ctx: Context,
    ): Athlete {

        this.autoUpdateWilks(id, data);
        return CrudAdapter.updateItem(this.collectionKey, id, data);
    }

    public autoUpdateWilks(id: string, input: any): Athlete | void {

        const athlete = this.athlete({id});
        const updateProps = Object.keys(input);
        const wilksUpdateProps = ["bodyWeight", "gender"];
        const shouldUpdateWilks = wilksUpdateProps.reduce((acc, cur) => {
            if (acc) { return acc; }
            return updateProps.indexOf(cur) > -1;
        }, false);

        if (shouldUpdateWilks) {
            return CrudAdapter.updateItem(this.collectionKey, id, {
                wilks: wilks(_.get(input, "gender", athlete.gender), _.get(input, "bodyWeight", athlete.bodyWeight)),
            });
        }

        return null;
    }

    @Mutation()
    public deleteAthlete(
        @Args() {id}: IdArgs,
        @Ctx() ctx: Context,
    ): Athlete {

        return CrudAdapter.removeItem(this.collectionKey, id);
    }

}
