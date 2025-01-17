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
      validate: {
        validator: function (v) {
          const year = this.year
          const getPlateRegex = (year) => {
            const patterns = {
              pre1992: /^[A-Za-z]{2}-\d{2}-\d{2}$/,
              "1992to2005": /^\d{2}-\d{2}-[A-Za-z]{2}$/,
              "2005to2020": /^\d{2}-[A-Za-z]{2}-\d{2}$/,
              post2020: /^[A-Za-z]{2}-\d{2}-[A-Za-z]{2}$/,
            }

            if (year < 1992) {
              return patterns.pre1992
            } else if (year >= 1992 && year <= 2005) {
              return patterns["1992to2005"]
            } else if (year > 2005 && year <= 2020) {
              return patterns["2005to2020"]
            } else {
              return patterns.post2020
            }
          }

          const plateRegex = getPlateRegex(year)
          return plateRegex.test(v)
        },
        message: (props) =>
          `${props.value} is not a valid plate number for the given year.`,
      },
    },
  },
  { collection: "cars", timestamps: true }
)

export default model("Car", CarSchema)
