import Car from "../models/carModel.js";
import User from "../models/userModel.js";
import logger from "../logger.js"

class CarInputDTO {
  constructor({
    cc,
    brand,
    model,
    year,
    user,
    color,
    plate,
  }) {
    if (
      !cc ||
      !brand ||
      !model ||
      !year ||
      !user ||
      !color ||
      !plate
    ) {
      throw new Error("MissingRequiredFields");
    }

    this.cc = cc;
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.user = user;
    this.color = color;
    this.plate = plate;
  }

  async toCar() {

    logger.debug("carInputDTO - toCar")
    const carDriver = await User.findOne({username: this.user})
    logger.debug("carInputDTO - toCar - carDriver")
    if(!carDriver) {
      throw new Error("DriverNotFound")
    }

    return new Car({
      cc: this.cc,
      brand: this.brand,
      model: this.model,
      year: this.year,
      user: carDriver._id,
      color: this.color,
      plate: this.plate,
    });
  }
}

export default CarInputDTO;
