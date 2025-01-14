import Lift from "../models/liftModel.js"
import User from "../models/userModel.js"
import logger from "../logger.js"
import { v4 as uuidv4 } from "uuid"

class LiftInputDTO {
  constructor({
    driver,
    startPoint,
    endPoint,
    schedule,
    price,
    providedSeats,
  }) {
    if (
      !driver ||
      !startPoint ||
      !endPoint ||
      !schedule ||
      price === undefined ||
      !providedSeats
    ) {
      throw new Error("MissingRequiredFields")
    }

    this.driver = driver
    this.startPoint = startPoint
    this.endPoint = endPoint
    this.schedule = schedule
    this.price = price
    this.providedSeats = providedSeats
  }

  async toLift() {
    logger.debug("LiftInputDTO - toLift")

    const liftDriver = await User.findOne({
      username: this.driver,
    })
    if (!liftDriver) {
      throw new Error("DriverNotFound")
    }

    const driverDetails = {
      email: liftDriver.email,
      username: liftDriver.username,
      name: liftDriver.name,
      contact: liftDriver.contact,
      role: liftDriver.role,
      driverRating: liftDriver.driverRating,
      passengerRating: liftDriver.passengerRating,
    }

    return new Lift({
      cl: uuidv4(),
      driver: driverDetails,
      startPoint: this.startPoint,
      endPoint: this.endPoint,
      schedule: this.schedule,
      price: this.price,
      providedSeats: this.providedSeats,
    })
  }
}

export default LiftInputDTO
