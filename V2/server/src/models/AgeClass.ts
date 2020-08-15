import * as mongoose from "mongoose";

type AgeClass = mongoose.Document & {
  id: string;
  name: string;
  sortId: number;
  createdAt: Date;
  updatedAt: Date;
};

const ageClassSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  sortId: {
    type: Number,
  },
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
});

const AgeClass = mongoose.model<AgeClass>("AgeClass", ageClassSchema);

export default AgeClass;