import { Schema, model } from "mongoose"

const CarSchema = new Schema(
  {
    cc: {
      type: String,
      unique: true,
      required: true,
    },
    brand: {
      type: String,
      required: true,
      lowercase: true,
      set: (value) => value.replace(/\s+/g, " ").trim(),
    },
    model: {
      type: String,
      required: true,
      lowercase: true,
      set: (value) => value.replace(/\s+/g, " ").trim(),
    },
    year: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    color: {
      type: String,
      required: true,
      lowercase: true,
      set: (value) => value.replace(/\s+/g, " ").trim(),
    },
    plate: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          const isOldPlate = this.year < 2000
          const oldPlateFormat = /^[A-Za-z]{2}\d{2}[A-Za-z]{2}$/
          const newPlateFormat = /^\d{2}-\d{2}-[A-Za-z]{2}$/

          if (isOldPlate) {
            return oldPlateFormat.test(v)
          } else {
            return newPlateFormat.test(v)
          }
        },
        message: function () {
          return "License plate format is invalid based on the car's year."
        },
      },
    },
  },
  { collection: "cars", timestamps: true }
)

export default model("Car", CarSchema)
