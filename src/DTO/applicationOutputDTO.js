class ApplicationOutputDTO {
  constructor(application) {
    this.ca = application.ca
    this.passenger = {
      name: application.passenger.name,
      username: application.passenger.username,
      email: application.passenger.email,
      contact: application.passenger.contact,
      passengerRating: application.passenger.passengerRating,
    }
    this.lift = {
      cl: application.lift.cl,
      driver: application.liftDriver,
      startPoint: application.lift.startPoint,
      endPoint: application.lift.endPoint,
      schedule: application.lift.schedule,
      price: application.lift.price,
      providedSeats: application.lift.providedSeats,
    }
    this.status = application.status
    this.createdAt = application.createdAt
    this.updatedAt = application.updatedAt
  }
}

export default ApplicationOutputDTO
