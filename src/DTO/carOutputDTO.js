class CarOutputDTO {
  constructor(car) {
    this.cc = car.cc
    this.brand = car.brand
    this.model = car.model
    this.year = car.year
    this.user = {
      name: car.user?.name || null,
      username: car.user?.username || null,
      email: car.user?.email || null,
      contact: car.user?.contact || null,
      driverRating: car.user?.driverRating || null,
    }
    this.color = car.color
    this.plate = car.plate
    this.createdAt = car.createdAt
    this.updatedAt = car.updatedAt
  }
}

export default CarOutputDTO
