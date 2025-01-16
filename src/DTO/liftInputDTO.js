import Lift from "../models/liftModel.js"
import User from "../models/userModel.js"
import logger from "../logger.js"
import { v4 as uuidv4 } from "uuid"
import Car from "../models/carModel.js"

class LiftInputDTO {
  constructor({
    driver,
    car,
    startPoint,
    endPoint,
    schedule,
    price,
    providedSeats,
  }) {
    if (
      !driver ||
      !car ||
      !startPoint.district ||
      !startPoint.municipality ||
      !startPoint.parish ||
      !endPoint.district ||
      !endPoint.municipality ||
      !endPoint.parish ||
      !schedule ||
      price === undefined ||
      !providedSeats
    ) {
      throw new Error("MissingRequiredFields")
    }

    this.driver = driver
    this.car = car
    this.startPoint = startPoint
    this.endPoint = endPoint
    this.schedule = new Date(schedule)
    this.price = price
    this.providedSeats = providedSeats

    if (isNaN(this.schedule.getTime())) {
      throw new Error("InvalidDateFormat")
    }

    if (this.schedule < Date.now()) {
      throw new Error("DateInPast")
    }
  }

  async toLift() {
    logger.debug("LiftInputDTO - toLift")

    const liftDriver = await User.findOne({
      username: this.driver,
    })

    if (!liftDriver) {
      throw new Error("DriverNotFound")
    }

    const liftCar = await Car.findOne({
      cc: this.car,
    })

    if (!liftCar) {
      throw new Error("CarNotFound")
    }

    return new Lift({
      cl: uuidv4(),
      driver: liftDriver._id,
      car: liftCar._id,
      startPoint: this.startPoint,
      endPoint: this.endPoint,
      schedule: this.schedule,
      price: this.price,
      providedSeats: this.providedSeats,
    })
  }
}

export default LiftInputDTO
