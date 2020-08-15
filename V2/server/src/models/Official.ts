import * as mongoose from "mongoose";
import Event from "./Event";

type Official = mongoose.Document & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  officialNumber: number;
  lastName: string;
  firstName: string;
  fullName: string;
  club: string;
  license: string;
  position: string;
  location: string;
  importId: number;
  event: Event;
};

const officialSchema = new mongoose.Schema({
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
  officialNumber: {
    type: Number,
  },
  lastName: {
    type: String,
  },
  firstName: {
    type: String,
  },
  club: {
    type: String,
  },
  license: {
    type: String,
  },
  position: {
    type: String,
  },
  location: {
    type: String,
  },
  importId: {
    type: Number,
  },
  event: {
    type: Event,
  },
});

officialSchema.virtual("fullName").get(() => this.firstName + this.lastName);

const Official = mongoose.model<Official, mongoose.Model<Official>>(
  "Official",
  officialSchema
);

export default Official;
