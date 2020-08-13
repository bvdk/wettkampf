import * as mongoose from "mongoose";
import Discipline from "../enums/Discipline";
import Athlete from "./Athlete";

type Attempt = mongoose.Document & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  discipline: Discipline;
  date: Date;
  index: number;
  weight: number;
  raw: boolean;
  valid: boolean;
  done: boolean;
  resign: boolean;
  athlete: Athlete;
};

const attemptSchema = new mongoose.Schema({
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
  discipline: {
    type: Discipline,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  index: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  raw: {
    type: Boolean,
  },
  valid: {
    type: Boolean,
  },
  done: {
    type: Boolean,
  },
  resign: {
    type: Boolean,
  },

  athlete: {
    type: Athlete,
  },
});

const Attempt = mongoose.model<Attempt>("Attempt", attemptSchema);

export default Attempt;
