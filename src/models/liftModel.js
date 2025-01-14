import { Schema, model } from "mongoose"

const LiftSchema = new Schema(
  {
    cl: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    driver: {
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
    startPoint: {
      type: String,
      required: true,
      lowercase: true,
      set: (value) => value.replace(/\s+/g, " ").trim(),
    },
    endPoint: {
      type: String,
      required: true,
      lowercase: true,
      set: (value) => value.replace(/\s+/g, " ").trim(),
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
      type: [
        {
          ca: {
            type: String,
            unique: true,
            required: true,
          },
          passenger: {
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
      ],
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
      enum: ["open", "inProgress", "finished", "closed"],
    },
  },
  { collection: "lifts", timestamps: true }
)

export default model("Lift", LiftSchema)
