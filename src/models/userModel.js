import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address format"],
    },
    username: {
      type: String,
      required: [true, "Username field is required"],
      unique: true,
      set: (value) =>
        value
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase(),
      validate: {
        validator: function (value) {
          return !/\s/.test(value);
        },
        message: "Username must not contain spaces.",
      },
    },
    name: {
      type: String,
      required: [true, "Name field is required"],
      set: (value) =>
        value
          ?.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .trim(),
    },
    contact: {
      type: String,
      match: [/^[+]?[0-9]{9,12}$/, "Invalid phone number format"],
      default: null,
    },
    role: {
      type: String,
      required: true,
      match: /^(admin|client)$/,
    },
    driverRating: {
      type: Number,
      required: true,
      default: 5,
      validate: {
        validator: (value) => value >= 1 && value <= 5,
        message: "Driver rating must be between 1 and 5.",
      },
      set: (value) => parseFloat(value.toFixed(2)),
    },
    passengerRating: {
      type: Number,
      required: true,
      default: 5,
      validate: {
        validator: (value) => value >= 1 && value <= 5,
        message: "Passenger rating must be between 1 and 5.",
      },
      set: (value) => parseFloat(value.toFixed(2)),
    },
  },
  { collection: "users", timestamps: true }
);

export default model("User", UserSchema);
