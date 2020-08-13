import * as mongoose from "mongoose";
import Event from "./Event";

type Slot = mongoose.Document & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  event: Event;
};

const slotSchema = new mongoose.Schema({
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
});

const Slot = mongoose.model<Slot>("Slot", slotSchema);

export default Slot;
