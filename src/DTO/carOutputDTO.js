class CarOutputDTO {
    constructor(car) {
      this.cc = car.cc
      this.brand = car.brand
      this.model = car.model
      this.year = car.year
      this.color = car.color
      this.plate = car.plate
      this.createdAt = car.createdAt
      this.updatedAt = car.updatedAt
    }
  }
  
  export default CarOutputDTO