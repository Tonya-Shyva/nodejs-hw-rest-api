const { Schema, model } = require("mongoose");

const userSchema = Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
      minlength: 6,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    avatarURL: {
      type: String,
      required: true,
    },
    token: { type: String, default: null },
  },
  { versionKey: false, timestamps: true }
);

const User = model("user", userSchema);

module.exports = User;
