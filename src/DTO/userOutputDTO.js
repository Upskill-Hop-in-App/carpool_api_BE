class UserOutputDTO {
  constructor(user) {
    this.email = user.email
    this.name = user.name
    this.username = user.username
    this.contact = user.contact
    this.role = user.role
    this.driverRating = user.driverRating
    this.passengerRating = user.passengerRating
  }
}

export default UserOutputDTO
