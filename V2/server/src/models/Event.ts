import * as mongoose from "mongoose";
import Discipline from "../enums/Discipline";
import ContestType from "../enums/ContestType";

type Event = mongoose.Document & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  date: Date;
  discipline: Discipline;
  contestType: ContestType;
};

const eventSchema = new mongoose.Schema({
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
