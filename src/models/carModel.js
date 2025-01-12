import { Schema, model } from "mongoose";

const CarSchema = new Schema(
  {
    cc: {
      type: String,
      unique: true,
      required: true,
      match: [
        /^[A-Za-z]{2}[1-9]{2}$/,
        "Car code must be exactly 2 letters followed by 2 numbers",
      ],
      lowercase: true,
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
        match: [
          /^[A-Za-z]{2}[1-9]{2}[A-Za-z]{2}$/,
          "Licence Plate must be ...",
        ],
    },
  },
  { collection: "cars", timestamps: true }
);

export default model("Car", CarSchema);
