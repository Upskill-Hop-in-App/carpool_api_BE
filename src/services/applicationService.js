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
    await application.populate([
      {
        path: "passenger",
      },
      {
        path: "lift",
        populate: {
          path: "driver",
        },
      },
    ])
    return application
  }

  async list() {
    logger.info("ApplicationService - list")
    const applications = await Application.find().populate([
      {
        path: "passenger",
      },
      {
        path: "lift",
        populate: {
          path: "driver",
        },
      },
    ])

    if (applications.length === 0) {
      throw new Error("NoApplicationFound")
    }
    return applications
  }

  async listByCode(code) {
    logger.info("ApplicationService - listByCode")
    const application = await Application.findOne({ ca: code }).populate([
      {
        path: "passenger",
      },
      {
        path: "lift",
        populate: {
          path: "driver",
        },
      },
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
    }).populate([
      {
        path: "passenger",
      },
      {
        path: "lift",
        populate: {
          path: "driver",
        },
      },
    ])

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
      {
        path: "passenger",
      },
      {
        path: "lift",
        populate: {
          path: "driver",
        },
      },
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
    }).populate([
      {
        path: "passenger",
      },
      {
        path: "lift",
        populate: {
          path: "driver",
        },
      },
    ])

    if (applications.length === 0) {
      throw new Error("NoApplicationFound")
    }
    return applications
  }

  async filterApplications(filters) {
    logger.info("ApplicationService - filterApplications")

    const query = {}

    //Filtrar campos maxdepth -1 do documento applications
    if (filters.ca) query.ca = filters.ca
    if (filters.status) {
      const validStatuses = ["pending", "accepted", "rejected"]
      if (!validStatuses.includes(filters.status))
        throw new Error("InvalidStatus")
      query.status = filters.status
    }

    const sort = filters.sort || { createdAt: -1 }

    const applications = await Application.find(query)
      .populate([
        {
          path: "passenger",
        },
        {
          path: "lift",
          populate: {
            path: "driver",
          },
        },
      ])
      .sort(sort)

    // Filtrar campos abaixo de depth -1
    const filteredApplications = applications.filter((application) => {
      if (
        filters.startPoint &&
        application.lift?.startPoint !== filters.startPoint
      ) {
        return false
      }

      if (filters.endPoint && application.lift?.endPoint !== filters.endPoint) {
        return false
      }

      if (
        filters.driver &&
        application.lift?.driver.username !== filters.driver
      ) {
        return false
      }

      if (
        filters.username &&
        application.passenger?.username !== filters.username
      ) {
        return false
      }

      if (
        filters.driverRating &&
        application.lift?.driver?.driverRating !== Number(filters.driverRating)
      ) {
        return false
      }

      return true
    })

    if (filteredApplications.length === 0) throw new Error("NoApplicationFound")

    return filteredApplications
  }

  async filterApplicationsByUsername(username, filters) {
    logger.info("ApplicationService - filterApplicationsByUsername")

    const user = await User.findOne({ username: username })
    if (!user) {
      throw new Error("UserNotFound")
    }

    //Garantir que o ponto de partida é um filtro por username dos params
    const query = { "passenger.username": username }

    if (filters.ca) query.ca = filters.ca
    if (filters.status) {
      const validStatuses = ["pending", "accepted", "rejected"]
      if (!validStatuses.includes(filters.status))
        throw new Error("InvalidStatus")
      query.status = filters.status
    }

    const sort = filters.sort || { createdAt: -1 }

    const applications = await Application.find(query)
      .populate([
        {
          path: "passenger",
        },
        {
          path: "lift",
          populate: {
            path: "driver",
          },
        },
      ])
      .sort(sort)

    const filteredApplications = applications.filter((application) => {
      if (
        filters.startPoint &&
        application.lift?.startPoint !== filters.startPoint
      ) {
        return false
      }

      if (filters.endPoint && application.lift?.endPoint !== filters.endPoint) {
        return false
      }

      if (
        filters.driver &&
        application.lift?.driver.username !== filters.driver
      ) {
        return false
      }

      if (
        filters.driverRating &&
        application.lift?.driver?.driverRating !== Number(filters.driverRating)
      ) {
        return false
      }

      return true
    })

    if (filteredApplications.length === 0) throw new Error("NoApplicationFound")

    return filteredApplications
  }
}

export default new ApplicationService()
