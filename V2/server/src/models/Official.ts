import mongoose, { Document, Schema } from "mongoose";
import Event from "./Event";

type Official = Document & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  officialNumber: number;
  lastName: string;
  firstName: string;
  club: string;
  license: string;
  position: string;
  location: string;
  importId: number;
  event: Event;
};

const officialSchema = new Schema({
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

const Official = mongoose.model<Official>("Official", officialSchema);

export default Official;
