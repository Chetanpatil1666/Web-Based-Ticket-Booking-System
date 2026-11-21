const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    gender: {
      type: String,
      default: "male",
      trim: true,
    },
    name: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Register model and aliases explicitly bound to 'usersses' collection
// This prevents Mongoose pluralization mismatch and handles both ref: "userss" and ref: "user"
const UserModel = mongoose.models.userss || model("userss", UserSchema, "usersses");

if (!mongoose.models.user) {
  model("user", UserSchema, "usersses");
}

module.exports = UserModel;
