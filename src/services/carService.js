import axios from "axios"
import logger from "../logger.js"

import Car from "../models/carModel.js"
import User from "../models/userModel.js"
import { getTokenFromHeaders } from "../middleware.js"
const isTestMode = process.env.NODE_ENV === "test"

let token

class CarService {
  async create(car, req) {
    logger.info("CarService - create")
    const { cc, brand, model, year, user, color, plate } = car
    let isValid

    if (isTestMode) {
      isValid = true
    } else {
      token = await getTokenFromHeaders(req.headers)
      isValid = await this.getCarValidation(brand, model, year, token)
    }

    if (isValid === false) {
      throw new Error("CarNotValid")
    }

    await car.save()
    return car.populate("user")
  }

  async list() {
    const cars = await Car.find().populate("user")
    if (cars.length === 0) {
      throw new Error("CarNotFound")
    }
    return cars
  }

  async listByCode(code) {
    const car = await Car.findOne({ cc: code }).populate("user")

    if (!car) {
      throw new Error("CarNotFound")
    }
    return car
  }

  async listByUsername(username) {
    const user = await User.findOne({ username: username })
    if (!user) {
      throw new Error("UserNotFound")
    }
    const cars = await Car.find({ user: user }).populate("user")
    if (cars.length === 0) {
      throw new Error("NoCarsFound")
    }
    return cars
  }

  async getCarValidation(brand, model, year, token) {
    try {
      logger.debug("CarService - create")
      const response = await axios.get(
        `http://localhost:3001/api/cars/verify/${brand}/${model}/${year}`,
        {
          headers: {
            Authorization: `Bearer ${isTestMode ? clientToken : token}`,
          },
        }
      )

      const isValid = response.data.data

      return isValid
    } catch (err) {
      return false
    }
  }

  async filterCars(username, filters) {
    logger.info("CarService - filterCars")

    const user = await User.findOne({ username: username })
    if (!user) {
      throw new Error("UserNotFound")
    }

    const query = { user: username }
    const allowedFilters = ["cc", "brand", "model", "year", "color", "plate"]

    const invalidFilters = Object.keys(filters).filter(
      (key) => !allowedFilters.includes(key)
    )

    if (invalidFilters.length > 0) {
      throw new Error("InvalidQuery")
    }

    allowedFilters.forEach((key) => {
      if (filters[key]) {
        query[key] = filters[key]
      }
    })

    if (filters.user) {
      const user = await User.findOne({
        username: filters.user.toLowerCase().trim(),
      })
      if (!user) throw new Error("UserNotFound")
      query.user = user._id
    }

    const sort = filters.sort || { createdAt: -1 }

    const cars = await Car.find(query)
      .populate([
        {
          path: "user",
        },
      ])
      .sort(sort)

    if (cars.length === 0) throw new Error("NoCarFound")

    return cars
  }

  async update(code, data) {
    const { brand, model, year, user, color, plate } = data

    const car = await Car.findOne({ cc: code }).populate("user")
    if (!car) {
      throw new Error("CarNotFound")
    }

    car.brand = car.brand
    car.model = car.model
    car.year = car.year
    car.color = color || car.color
    car.plate = plate || car.plate

    await car.save()

    return car
  }
  async delete(code) {
    const car = await Car.findOne({ cc: code })
    if (!car) {
      throw new Error("CarNotFound")
    }
    await car.deleteOne()
  }
}

export default new CarService()
