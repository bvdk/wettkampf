import _ from "lodash";
import {FieldResolver, Resolver, ResolverInterface, Root} from "type-graphql";
import {Official} from "../models/official";

@Resolver((of) => Official)
export default class OfficialResolver implements ResolverInterface<Official> {

    @FieldResolver()
    public name(@Root() official: Official) {

        const fistName = _.get(official, "firstName");
        const lastName = _.get(official, "lastName");

        return `${lastName}, ${fistName}`;
    }


}
