import _ from "lodash";
import {ArgsType, Field, Query, Resolver} from "type-graphql";
import packageJSON from "../../package.json";
import {System} from "../models/System";



@Resolver()
export default class SystemsResolver {

    @Query((returns) => System, { description: "System info" })
    public system(): System {
        return {
            id: _.get(packageJSON, "name", "bvdk-wertung"),
            version: _.get(packageJSON, "version", ""),
            name: "Bundesverband Deutscher Kraftdreikämpfer e.V. 2018 ",
        };
    }


}
