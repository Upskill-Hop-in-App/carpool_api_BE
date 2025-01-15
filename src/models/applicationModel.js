import { Schema, model } from "mongoose"

const ApplicationSchema = new Schema(
  {
    ca: {
      type: String,
      unique: true,
      required: true,
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
    },
    receivedPassengerRating: {
      type: Number,
      default: null,
      validate: {
        validator: (value) => (value >= 1 && value <= 5) || value == null,
        message: "Rating must be between 1 and 5.",
      },
    },
  },
  { collection: "applications", timestamps: true }
)

export default model("Application", ApplicationSchema)
