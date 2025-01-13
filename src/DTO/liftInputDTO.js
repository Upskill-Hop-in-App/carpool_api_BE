import Lift from "../models/liftModel.js"
/* import User from "../models/userModel.js"; */

class LiftInputDTO {
  constructor({
    cl,
    driver,
    // car,
    startPoint,
    endPoint,
    schedule,
    price,
    providedSeats,
  }) {
    if (
      !cl ||
      !driver ||
      // !car ||
      !startPoint ||
      !endPoint ||
      !schedule ||
      price === undefined ||
      !providedSeats
    ) {
      throw new Error("MissingRequiredFields")
    }

    this.cl = cl
    this.driver = driver
    // this.car = car;
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

    // const liftCar = await Car.findOne({
    //   cc: this.car,
    // });
    // if (!liftCar) {
    //   throw new Error("CarNotFound");
    // }

    return new Lift({
      cl: this.cl,
      driver: liftDriver._id,
      // car: liftCar._id,
      startPoint: this.startPoint,
      endPoint: this.endPoint,
      schedule: this.schedule,
      price: this.price,
      providedSeats: this.providedSeats,
    })
  }
}

export default LiftInputDTO
