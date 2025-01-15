import axios from "axios"
import logger from "../logger.js"
import { MESSAGES } from "../utils/responseMessages.js"

import Car from "../models/carModel.js"

class CarService {
  async create(car) {
    logger.info("CarService - create")
    const { cc, brand, model, year, user, color, plate } = car

    const isValid = await this.getCarValidation(brand, model, year)

    if (isValid === false) {
      throw new Error("CarNotValid")
    }

    await car.save()
    return car.populate("user")
  }

  async list() {
    const cars = await Car.find().populate("user")
    if (cars.length === 0) {
      throw new Error("NoCarFound")
    }
    return cars
  }

  async listByCode(code) {
    const car = await Car.findOne({ cc: code }).populate("user")

    if (!car) {
      throw new Error("NoCarFound")
    }
    return car
  }

  async getCarValidation(brand, model, year) {
    try {
      logger.debug("CarService - create")
      const response = await axios.get(
        `${"http://localhost:3001"}/api/cars/verify/${brand}/${model}/${year}`
      )
      const isValid = response.data.data

      return isValid
    } catch (err) {
      return { data: { error: MESSAGES.FAILED_TO_RETRIEVE_VALIDATION_INFO } }
    }
  }

  async update(code, data) {
    const { cc, brand, model, year, user, color, plate } = data

    const car = await Car.findOne({ cc: code }).populate("user")
    if (!car) {
      throw new Error("CarNotFound")
    }

    car.cc = cc || car.cc
    car.brand = car.brand
    car.model = car.model
    car.year = car.year
    car.color = color || car.color
    car.plate = plate || car.plate

    await car.save()

    return car
  }
  async delete(code) {
    const car = Car.findOne({ cc: code })
    if (!car) {
      throw new Error("CarNotFound")
    }
    await car.deleteOne()
  }
}

export default new CarService()
