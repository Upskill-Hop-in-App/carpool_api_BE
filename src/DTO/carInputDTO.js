import Car from "../models/carModel.js";

class CarInputDTO {
  constructor({
    cc,
    brand,
    model,
    year,
    color,
    plate,
  }) {
    if (
      !cc ||
      !brand ||
      !model ||
      !year ||
      !color ||
      !plate
    ) {
      throw new Error("MissingRequiredFields");
    }

    this.cc = cc;
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.color = color;
    this.plate = plate;
  }

  async toCar() {
    return new Car({
      cc: this.cc,
      brand: this.brand,
      model: this.model,
      year: this.year,
      color: this.color,
      plate: this.plate,
    });
  }
}

export default CarInputDTO;
