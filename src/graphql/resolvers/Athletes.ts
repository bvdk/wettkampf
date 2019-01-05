import {Context} from "graphql-cli";
import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import Athlete, {AthleteInput} from "../models/athlete";

@Resolver()
export default class AthletesResolver {

    private collectionKey: string = Athlete.collectionKey;

    @Query((returns) => [Athlete], { description: "" })
    public athletes(): Athlete[] {
        return CrudAdapter.getAll(this.collectionKey);
    }

    @Query((returns) => Athlete, { description: "" })
    public event(
        @Arg("id") id: string,
    ): Athlete {
        return CrudAdapter.getItem(this.collectionKey, id);
    }

    @Mutation()
    public createAthlete(
        @Arg("data") data: AthleteInput,
        @Ctx() ctx: Context,
    ): Athlete {
        return CrudAdapter.insertItem(this.collectionKey, data);
    }

    @Mutation()
    public updateAthlete(
        @Arg("id") id: string,
        @Arg("data") data: AthleteInput,
        @Ctx() ctx: Context,
    ): Athlete {

        return CrudAdapter.updateItem(this.collectionKey, id, data);
    }

    @Mutation()
    public deleteAthlete(
        @Arg("id") id: string,
        @Ctx() ctx: Context,
    ): Athlete {

        return CrudAdapter.removeItem(this.collectionKey, id);
    }

}
