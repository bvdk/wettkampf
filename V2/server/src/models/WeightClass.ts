import * as mongoose from "mongoose";
import Gender from "../enums/Gender";

type WeightClass = mongoose.Document & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  gender: Gender;
  min: number;
  max: number;
};

const weightClassSchema = new mongoose.Schema({
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
  gender: {
    type: Gender,
  },
  min: {
    type: Number,
  },
  max: {
    type: Number,
  },
});

const WeightClass = mongoose.model<WeightClass>(
  "WeightClass",
  weightClassSchema
);

export default WeightClass;
