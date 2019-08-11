import  _ from "lodash";
import {Args, FieldResolver, Resolver, ResolverInterface, Root} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import {AgeClass} from "../models/ageClass";
import { Athlete } from "../models/athlete";
import {AthleteGroup} from "../models/athleteGroup";
import {getDescriptionForGender} from "../models/gender";
import {Slot} from "../models/slot";
import {WeightClass} from "../models/weightClass";
import AgeClassesResolver from "./AgeClasses";
import SortArgs from "./args/SortArgs";
import WeightClasses from "./WeightClasses";

@Resolver((of) => AthleteGroup)
export default class AthleteGroupResolver implements ResolverInterface<AthleteGroup> {


    @FieldResolver()
    public name(@Root() athleteGroup: AthleteGroup) {
        if (athleteGroup.name) { return athleteGroup.name; }

        const nameComponents = [];
        if (athleteGroup.gender) {
            nameComponents.push(getDescriptionForGender(athleteGroup.gender));
        }
        if (athleteGroup.ageClassId) {
            const ageClassResolver = new AgeClassesResolver();
            const ageClass = ageClassResolver.ageClass({id: athleteGroup.ageClassId});
            nameComponents.push(ageClass.name);
        }
        if (athleteGroup.weightClassId) {
            const weightClassResolver = new WeightClasses();
            const weightClass = weightClassResolver.weightClass({id: athleteGroup.weightClassId});
            nameComponents.push(weightClass.name);
        }

        return nameComponents.join(" - ");
    }

    @FieldResolver()
    public shallow(@Root() athleteGroup: AthleteGroup) {
        return _.get(athleteGroup, "shallow", false);
    }

    @FieldResolver()
    public raw(@Root() athleteGroup: AthleteGroup) {
        return _.get(athleteGroup, "raw", false);
    }


    @FieldResolver()
    public weightClass(@Root() athleteGroup: AthleteGroup) {
        if (athleteGroup.weightClassId) {
            return CrudAdapter.getItem(WeightClass.collectionKey, athleteGroup.weightClassId);
        }
        return null;
    }

    @FieldResolver()
    public ageClass(@Root() athleteGroup: AthleteGroup) {
        if (athleteGroup.ageClassId) {
            return CrudAdapter.getItem(AgeClass.collectionKey, athleteGroup.ageClassId);
        }
        return null;
    }

    @FieldResolver()
    public athletes(
        @Root() athleteGroup: AthleteGroup,
        @Args() sort?: SortArgs,
    ) {
        if (athleteGroup.athletes) {
            return athleteGroup.athletes;
        }
        return CrudAdapter.filter(Athlete.collectionKey, {athleteGroupId: athleteGroup.id});
    }

    @FieldResolver()
    public athleteCount(@Root() athleteGroup: AthleteGroup) {
        return _.size(this.athletes(athleteGroup));
    }

    @FieldResolver()
    public slot(@Root() athleteGroup: AthleteGroup) {
        if (athleteGroup.slotId) {
            return CrudAdapter.getItem(Slot.collectionKey, athleteGroup.slotId);
        }
        return null;
    }

    @FieldResolver()
    public active(@Root() athleteGroup: AthleteGroup) {
        const slot: Slot = this.slot(athleteGroup);
        if (!slot) { return false; }
        return athleteGroup.id === slot.activeAthleteGroupId;
    }
}
