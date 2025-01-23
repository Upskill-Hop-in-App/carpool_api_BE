import { Schema, model } from "mongoose"

const LiftSchema = new Schema(
  {
    cl: {
      type: String,
      unique: true,
      required: true,
    },
    driver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    startPoint: {
      type: new Schema(
        {
          district: {
            type: String,
            required: true,
            lowercase: true,
            set: (value) => value.replace(/\s+/g, " ").trim(),
          },
          municipality: {
            type: String,
            required: true,
            lowercase: true,
            set: (value) => value.replace(/\s+/g, " ").trim(),
          },
          parish: {
            type: String,
            required: true,
            lowercase: true,
            set: (value) => value.replace(/\s+/g, " ").trim(),
          },
        },
        { _id: false }
      ),
      required: true,
    },
    endPoint: {
      type: new Schema(
        {
          district: {
            type: String,
            required: true,
            lowercase: true,
            set: (value) => value.replace(/\s+/g, " ").trim(),
          },
          municipality: {
            type: String,
            required: true,
            lowercase: true,
            set: (value) => value.replace(/\s+/g, " ").trim(),
          },
          parish: {
            type: String,
            required: true,
            lowercase: true,
            set: (value) => value.replace(/\s+/g, " ").trim(),
          },
        },
        { _id: false }
      ),
      required: true,
    },
    schedule: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be greater than 0"],
    },
    providedSeats: {
      type: Number,
      min: [0, "There must be at least one free seat"],
      required: true,
    },
    applications: {
      type: [{ type: Schema.Types.ObjectId, ref: "Application" }],
      default: [],
    },
    occupiedSeats: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value) {
          return value <= this.providedSeats
        },
        message:
          "Occupied seats ({VALUE}) can't be greater than provided seats",
      },
    },
    status: {
      type: String,
      default: "open",
      enum: ["open", "ready", "inProgress", "finished", "closed", "canceled"],
    },
    receivedDriverRatings: {
      type: [Number],
      default: [],
      validate: {
        validator: function (ratings) {
          // Ensure it's an array and all elements are valid
          return ratings.every((rating) => (rating >= 1 && rating <= 5) || rating === null);
        },
        message: "All ratings must be between 1 and 5 or null.",
      },
    },    
  },
  { collection: "lifts", timestamps: true }
)

export default model("Lift", LiftSchema)
