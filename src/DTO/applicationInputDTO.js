import User from "../models/userModel.js"
import Lift from "../models/liftModel.js"
import Application from "../models/applicationModel.js"
import logger from "../logger.js"
import { v4 as uuidv4 } from "uuid"

class ApplicationInputDTO {
  constructor(data) {
    const { passenger, lift } = data

    if (!passenger || !lift) {
      throw new Error("MissingRequiredFields")
    }

    this.passenger = passenger
    this.lift = lift
  }

  async toApplication() {
    logger.info("applicationInputDTO - toApplication")
    const user = await User.findOne({
      username: this.passenger,
    })
    if (!user) {
      throw new Error("PassengerNotFound")
    }

    const lift = await Lift.findOne({
      cl: this.lift,
    })
    if (!lift) {
      throw new Error("LiftNotFound")
    }

    return new Application({
      ca: uuidv4(),
      passenger: user._id,
      lift: lift._id,
    })
  }
}

export default ApplicationInputDTO
