import Lift from "../models/liftModel.js";
import User from "../models/userModel.js";
import logger from "../logger.js";
import Application from "../models/applicationModel.js";
// import Car from "../models/carModel.js";

class ApplicationService {

  async create(application) {
    logger.info("applicationService - create")
    const { ca, passenger, lift } = application

    const passengerDoc = await User.findOne({ _id: passenger })
    if (!passengerDoc && passenger !== undefined) {
      throw new Error("PassengerNotFound")
    }

    const liftDoc = await Lift.findOne({ _id: lift })
    if (!liftDoc) {
      throw new Error("LiftNotFound")
    }

    const sameApplication = await Application.findOne({passenger: passengerDoc._id, lift: liftDoc._id})
    if (sameApplication){
      throw new Error("ApplicationAlreadyExists")
    }

    await application.save()
    await Lift.updateOne(
      { _id: liftDoc._id },
      { $push: { applications: application._id } }
    );
    await application.populate(["passenger","lift"])
    return application;
  }
  
}

export default new ApplicationService();