class ApplicationOutputDTO {
  constructor(application) {
    this.ca = application.ca
    this.passenger = {
      name: application.passenger?.name,
      username: application.passenger?.username,
      email: application.passenger?.email,
      contact: application.passenger?.contact,
      passengerRating: application.passenger?.passengerRating,
    }
    this.lift = {
      cl: application.lift?.cl,
      driver: {
        name: application.lift.driver?.name,
        username: application.lift.driver?.username,
        driverRating: application.lift.driver?.driverRating,
        contact: application.lift.driver?.contact,
        email: application.lift.driver?.email,
      },
      car: {
        cc: application.lift.car?.cc || null,
        brand: application.lift.car?.brand || null,
        model: application.lift.car?.model || null,
        year: application.lift.car?.year || null,
        color: application.lift.car?.color || null,
        plate: application.lift.car?.plate || null,
      },
      startPoint: application.lift?.startPoint,
      endPoint: application.lift?.endPoint,
      schedule: application.lift?.schedule,
      price: application.lift?.price,
      providedSeats: application.lift?.providedSeats,
      status: application.lift?.status,
    }
    ;(this.status = application.status),
      (this.receivedPassengerRating = application.receivedPassengerRating),
      (this.createdAt = application.createdAt)
    this.updatedAt = application.updatedAt
  }
}

export default ApplicationOutputDTO
