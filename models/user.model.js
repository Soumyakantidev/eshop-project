/**
 * This file will contain the schema of the user model
 */
const { trusted } = require("mongoose");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    minLength: 10,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    default: "CUSTOMER",
  },
  userStatus: {
    type: String,
    requires: true,
    default: "APPROVED",
  },
  createdAt: {
    type: Date,
    default: () => {
      return Date.now();
    },
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: () => {
      return Date.now();
    },
  },
});
module.exports = mongoose.model("User", userSchema);
