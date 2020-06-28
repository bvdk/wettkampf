import mongoose, { Document, Schema } from "mongoose";
import Discipline from "../enums/Discipline";
import ContestType from "../enums/ContestType";

type Event = Document & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  date: Date;
  discipline: Discipline;
  contestType: ContestType;
};

const eventSchema = new Schema({
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
  discipline: {
    type: Discipline,
  },
  contestType: {
    type: ContestType,
  },
});

const Event = mongoose.model<Event>("Event", eventSchema);

export default Event;
