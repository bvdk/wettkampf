import {FieldResolver, Query, Resolver, ResolverInterface, Root} from "type-graphql";
import {Event} from "../models/event";

@Resolver((of) => Event)
export default class EventResolver implements ResolverInterface<Event> {


}
