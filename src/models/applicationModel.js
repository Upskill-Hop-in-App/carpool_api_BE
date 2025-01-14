import { Schema, model } from "mongoose"

const ApplicationSchema = new Schema(
  {
    ca: {
      type: String,
      unique: true,
      required: true,
    },
    passenger: {
      type: new Schema(
        {
          email: {
            type: String,
            required: true,
            match: [
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              "Invalid email address format",
            ],
          },
          username: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
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
          },
          passengerRating: {
            type: Number,
            required: true,
            default: 5,
          },
        },
        { _id: false }
      ),
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
