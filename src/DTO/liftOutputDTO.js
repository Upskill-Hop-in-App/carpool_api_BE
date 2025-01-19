class LiftOutputDTO {
  constructor(lift) {
    this.cl = lift.cl
    this.driver = {
      name: lift.driver?.name || null,
      username: lift.driver?.username || null,
      email: lift.driver?.email || null,
      contact: lift.driver?.contact || null,
      driverRating: lift.driver?.driverRating || null,
    }
    this.car = {
      cc: lift.car?.cc || null,
      brand: lift.car?.brand || null,
      model: lift.car?.model || null,
      year: lift.car?.year || null,
      color: lift.car?.color || null,
      plate: lift.car?.plate || null,
    }
    this.startPoint = {
      district: lift.startPoint.district || null,
      municipality: lift.startPoint.municipality || null,
      parish: lift.startPoint.parish || null,
    }
    this.endPoint = {
      district: lift.endPoint.district || null,
      municipality: lift.endPoint.municipality || null,
      parish: lift.endPoint.parish || null,
    }
    this.schedule = lift.schedule
    this.price = lift.price
    this.providedSeats = lift.providedSeats
    this.applications = Array.isArray(lift.applications)
      ? lift.applications.map((application) => ({
          ca: application?.ca || null,
          passenger: {
            name: application.passenger?.name || null,
            username: application.passenger?.username || null,
            email: application.passenger?.email || null,
            contact: application.passenger?.contact || null,
            passengerRating: application.passenger?.passengerRating || null,
          },
          status: application?.status || null,
        }))
      : []
    this.occupiedSeats = lift.occupiedSeats
    ;(this.status = lift.status), (this.createdAt = lift.createdAt)
    this.updatedAt = lift.updatedAt
  }
}

export default LiftOutputDTO
