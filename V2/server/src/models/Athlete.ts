import * as mongoose from "mongoose";
import Gender from "../enums/Gender";
import Event from "./Event";
import AgeClass from "./AgeClass";
import WeightClass from "./WeightClass";

type Athlete = mongoose.Document & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  raw: boolean;
  athleteNumber: number;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: Gender;
  club: string;
  birthday: Date;
  total: number;
  norm: boolean;
  lateRegistration: boolean;
  price: number;
  bodyWeight: number;
  wilks: number;
  dots: number;
  los: number;
  KB1: number;
  KB2: number;
  KB3: number;
  BD1: number;
  BD2: number;
  BD3: number;
  KH1: number;
  KH2: number;
  KH3: number;
  points: number;
  place: number;
  location: string;
  nextAttemptsSortKeys: string;
  importId: number;
  resultClassId: string;

  event: Event;
  ageClass: AgeClass;
  weightClass: WeightClass;
};

const athleteSchema = new mongoose.Schema({
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
  raw: {
    type: Boolean,
  },
  athleteNumber: {
    type: Number,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  gender: {
    type: Gender,
  },
  club: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  total: {
    type: Number,
  },
  norm: {
    type: Boolean,
  },
  lateRegistration: {
    type: Boolean,
  },
  price: {
    type: Number,
  },
  bodyWeight: {
    type: Number,
  },
  wilks: {
    type: Number,
  },
  dots: {
    type: Number,
  },
  los: {
    type: Number,
  },
  KB1: {
    type: Number,
  },
  KB2: {
    type: Number,
  },
  KB3: {
    type: Number,
  },
  BD1: {
    type: Number,
  },
  BD2: {
    type: Number,
  },
  BD3: {
    type: Number,
  },
  KH1: {
    type: Number,
  },
  KH2: {
    type: Number,
  },
  KH3: {
    type: Number,
  },
  points: {
    type: Number,
  },
  place: {
    type: Number,
  },
  location: {
    type: String,
  },
  nextAttemptsSortKeys: {
    type: String,
  },
  importId: {
    type: Number,
  },
  resultClassId: {
    type: String,
  },

  event: {
    type: Event,
  },
  ageClass: {
    type: AgeClass,
  },
  weightClass: {
    type: WeightClass,
  },
});

athleteSchema.virtual("fullName").get(() => this.firstName + this.lastName);

const Athlete = mongoose.model<Athlete, mongoose.Model<Athlete>>(
  "Athlete",
  athleteSchema
);

export default Athlete;
