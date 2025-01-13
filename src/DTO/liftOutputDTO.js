class LiftOutputDTO {
    constructor(lift) {
      this.cl = lift.cl;
      this.driver = {
        name: lift.driver?.name || null,
        username: lift.driver?.username || null,
        email: lift.driver?.email || null,
        contact: lift.driver?.contact || null,
        driverRating: lift.driver?.driverRating || null,
      };
      // this.car = lift.car?.cc || lift.car;
      this.startPoint = lift.startPoint;
      this.endPoint = lift.endPoint;
      this.schedule = lift.schedule;
      this.price = lift.price;
      this.providedSeats = lift.providedSeats;
      this.applications = Array.isArray(lift.applications)
        ? lift.applications.map(application => ({
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
        : [];
      this.occupiedSeats = lift.occupiedSeats;
      this.createdAt = lift.createdAt;
      this.updatedAt = lift.updatedAt;
    }
  }
  
  export default LiftOutputDTO;