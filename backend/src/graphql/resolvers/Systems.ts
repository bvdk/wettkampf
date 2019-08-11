import _ from "lodash";
import {Query, Resolver} from "type-graphql";
import packageJSON from "../../../package.json";
import {System} from "../models/system";

@Resolver()
export default class SystemsResolver {

    @Query((returns) => System, { description: "System info" })
    public system(): System {
        return {
            id: _.get(packageJSON, "name", "bvdk-wertung"),
            name: "Bundesverband Deutscher Kraftdreikämpfer e.V. 2018 ",
            version: _.get(packageJSON, "version", ""),
        };
    }
}
