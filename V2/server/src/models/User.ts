import * as mongoose from "mongoose";
import Role from "../enums/Role";

type User = mongoose.Document & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  passwordHash: string;
  salt: string;
  role: Role;
};

const userSchema = new mongoose.Schema({
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
  username: {
    type: String,
  },
  passwordHash: {
    type: String,
  },
  salt: {
    type: String,
  },
  role: {
    type: Role,
  },
});

const User = mongoose.model<User>("User", userSchema);

export default User;
