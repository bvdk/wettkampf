import * as mongoose from "mongoose";
import Event from "./Event";
import Slot from "./Slot";

type AthleteGroup = mongoose.Document & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  event: Event;
  slot: Slot;
};

const athleteGroupSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  name: {
    type: String,
  },
  event: {
    type: Event,
  },
  slot: {
    type: Slot,
  },
});

const AthleteGroup = mongoose.model<AthleteGroup>(
  "AthleteGroup",
  athleteGroupSchema
);

export default AthleteGroup;
