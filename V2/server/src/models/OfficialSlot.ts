import mongoose, { Document, Schema } from "mongoose";
import Slot from "./Slot";
import Official from "./Official";
import Position from "../enums/Position";

type OfficialSlot = Document & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  position: Position;
  official: Official;
  slot: Slot;
};

const officialSlotSchema = new Schema({
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
  position: {
    type: Position,
  },
  official: {
    type: Official,
  },
  slot: {
    type: Slot,
  },
});

const OfficialSlot = mongoose.model<OfficialSlot>(
  "OfficialSlot",
  officialSlotSchema
);

export default OfficialSlot;
