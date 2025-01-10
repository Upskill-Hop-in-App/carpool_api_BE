class LiftOutputDTO {
    constructor(lift) {
      this.cl = lift.cl
      /* this.driver = lift.driver?.username || lift.driver
      this.car = lift.car?.cc || lift.car */
      this.startPoint = lift.startPoint
      this.endPoint = lift.endPoint
      this.schedule = lift.schedule
      this.price = lift.price
      this.providedSeats = lift.providedSeats
      this.occupiedSeats = lift.occupiedSeats
      this.createdAt = lift.createdAt
      this.updatedAt = lift.updatedAt
    }
  }
  
  export default LiftOutputDTO