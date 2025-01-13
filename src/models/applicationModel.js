import { Schema, model } from "mongoose";

const ApplicationSchema = new Schema(
  {
    ca: {
      type: String,
      unique: true,
      required: true,
      match: [
        /^[1-9]{2}[A-Za-z]{3}$/,
        "Lift code must be exactly 2 numbers followed by 3 letters",
      ],
      lowercase: true,
    },
    passenger: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    lift: {
      type: Schema.Types.ObjectId,
      ref: "Lift",
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],
    }
  },
  { collection: "applications", timestamps: true }
);

export default model("Application", ApplicationSchema);
