import {FieldResolver, Resolver, ResolverInterface, Root} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import { Attempt } from "../models/attempt";

@Resolver((of) => Attempt)
export default class AttemptResolver implements ResolverInterface<Attempt> {

    @FieldResolver()
    public valid(@Root() attempt: Attempt) {
        return !!attempt.valid;
    }

    @FieldResolver()
    public done(@Root() attempt: Attempt) {
        return !!attempt.done;
    }

    @FieldResolver()
    public date(@Root() attempt: Attempt) {
        return new Date(attempt.date);
    }

}
