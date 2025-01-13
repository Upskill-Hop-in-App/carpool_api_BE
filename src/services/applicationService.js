import Lift from "../models/liftModel.js"
import User from "../models/userModel.js"
import logger from "../logger.js"
import Application from "../models/applicationModel.js"
// import Car from "../models/carModel.js";

class ApplicationService {
  async create(application) {
    logger.info("applicationService - create")
    const { passenger, lift } = application

    const passengerDoc = await User.findOne({ _id: passenger })
    if (!passengerDoc && passenger !== undefined) {
      throw new Error("PassengerNotFound")
    }

    const liftDoc = await Lift.findOne({ _id: lift })
    if (!liftDoc) {
      throw new Error("LiftNotFound")
    }

    if (liftDoc.status !== "open") {
      throw new Error("LiftStatusNotOpen")
    }

    const sameApplication = await Application.findOne({
      passenger: passengerDoc._id,
      lift: liftDoc._id,
    })
    if (sameApplication) {
      throw new Error("ApplicationAlreadyExists")
    }

    await application.save()
    await Lift.updateOne(
      { _id: liftDoc._id },
      { $push: { applications: application._id } }
    )
    await application.populate(["passenger", "lift"])
    return application
  }

  async list() {
    logger.info("ApplicationService - list")
    const applications = await Application.find().populate([
      "passenger",
      "lift",
    ])

    if (applications.length === 0) {
      throw new Error("NoApplicationFound")
    }
    return applications
  }

  async listByCode(code) {
    logger.info("ApplicationService - listByCode")
    const application = await Application.findOne({ ca: code }).populate([
      "passenger",
      "lift",
    ])

    if (!application) {
      throw new Error("ApplicationNotFound")
    }
    return application
  }

  async listByPassenger(param, paramValue) {
    logger.info("ApplicationService - listByPassenger")
    const user = await User.findOne({ [param]: paramValue })

    if (!user) {
      throw new Error("UserNotFound")
    }

    const applications = await Application.find({
      passenger: user._id,
    }).populate(["passenger", "lift"])

    if (applications.length === 0) {
      throw new Error("NoApplicationFound")
    }
    return applications
  }

  async listByStatus(status) {
    logger.info("ApplicationService - listByStatus")
    if (
      status !== "pending" &&
      status !== "rejected" &&
      status !== "accepted"
    ) {
      throw new Error("InvalidStatus")
    }

    const applications = await Application.find({ status: status }).populate([
      "passenger",
      "lift",
    ])

    if (applications.length === 0) {
      throw new Error("NoApplicationFound")
    }
    return applications
  }

  async listByPassengerAndStatus(param, paramValue, status) {
    logger.info("ApplicationService - listByUsernameAndStatus")
    if (
      status !== "pending" &&
      status !== "rejected" &&
      status !== "accepted"
    ) {
      throw new Error("InvalidStatus")
    }

    const user = await User.findOne({ [param]: paramValue })
    if (!user) {
      throw new Error("UserNotFound")
    }

    const applications = await Application.find({
      passenger: user._id,
      status: status,
    }).populate(["passenger", "lift"])

    if (applications.length === 0) {
      throw new Error("NoApplicationFound")
    }
    return applications
  }
}

export default new ApplicationService()
