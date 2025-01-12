import Car from "../models/carModel.js";

class CarService {

  async create(car) {
    const { cc, brand, model, year, color, plate } = car

    await car.save()
    return car
  }

  async list() {
    const cars = await Car.find()
    if(cars.length === 0) {
        throw new Error("NoCarFound")
    }
    return cars
  }

  async listByCode(code) {
    const car = await Car.findOne({cc: code})

    if(!car) {
        throw new Error("NoCarFound")
    }
    return car
  }
  async update(code, data) {
    const { cc, brand, model, year, color, plate } = data

    const car = await Car.findOne({ cc: cc })
    if (!car) {
      throw new Error("CarNotFound")
    }

    Object.assign(car, data)
    await car.save()

    return car
  }
  async delete(code) {

    const car = Car.findOne({cc: code})
    if(!car) {
        throw new Error("CarNotFound")
    }
    await car.deleteOne()
  }
}

export default new CarService();
