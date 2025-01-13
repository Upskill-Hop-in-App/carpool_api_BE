import User from "../models/userModel.js";
import Lift from "../models/liftModel.js";
import Application from "../models/applicationModel.js";

class ApplicationInputDTO {
  constructor(data) {
    const { ca, passenger, lift } = data;

    if (!ca || !passenger || !lift) {
      throw new Error("MissingRequiredFields");
    }
    this.ca = ca;
    this.passenger = passenger;
    this.lift = lift;
  }

  async toApplication() {
    const user = await User.findOne({
      username: this.passenger,
    });
    if (!user) {
      throw new Error("PassengerNotFound");
    }

    const lift = await Lift.findOne({
      cl: this.lift,
    });
    if (!lift) {
      throw new Error("LiftNotFound");
    }

    return new Application({
      ca: this.ca,
      passenger: user._id,
      lift: lift._id,
    });
  }
}

export default ApplicationInputDTO;
