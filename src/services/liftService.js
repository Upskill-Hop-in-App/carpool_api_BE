import Lift from "../models/liftModel.js"
import User from "../models/userModel.js"
import Car from "../models/carModel.js"
import Application from "../models/applicationModel.js"
import logger from "../logger.js"
import axios from "axios"

class LiftService {
  async create(lift) {
    logger.info("LiftService - create")

    const fullStartLocation = `${lift.startPoint.district}/${lift.startPoint.municipality}/${lift.startPoint.parish}`

    const fullEndLocation = `${lift.endPoint.district}/${lift.endPoint.municipality}/${lift.endPoint.parish}`

    if (fullStartLocation === fullEndLocation) {
      throw new Error("MatchingLocations")
    }

    const isValidStart = await this.getGeoValidation(lift.startPoint)

    const isValidEnd = await this.getGeoValidation(lift.endPoint)

    if (!(isValidStart && isValidEnd)) {
      throw new Error("InvalidLocation")
    }

    await lift.save()
    await lift.populate([
      {
        path: "driver",
      },
      {
        path: "applications",
        populate: {
          path: "passenger",
          model: "User",
        },
      },
      {
        path: "car",
      },
    ])

    return lift
  }

  async getGeoValidation(location) {
    try {
      logger.debug("LiftService - getGeoValidation")

      const districtResponse = await axios.get(
        `https://json.geoapi.pt/distrito/${encodeURIComponent(
          location.district
        )}`
      )

      if (districtResponse.status !== 200) return false

      const foundMunicipio = districtResponse.data.municipios.find(
        (m) => m.nome.toLowerCase() === location.municipality
      )
      if (!foundMunicipio) return false

      const municipalityResponse = await axios.get(
        `https://json.geoapi.pt/municipio/${encodeURIComponent(
          location.municipality
        )}`
      )

      if (municipalityResponse.status !== 200) return false

      const foundParish = municipalityResponse.data.geojsons.freguesias.find(
        (f) => f.properties.Freguesia.toLowerCase() === location.parish
      )

      return !!foundParish
    } catch (err) {
      logger.debug("LiftService - getGeoValidation - err")
      return false
    }
  }

  async list() {
    logger.info("LiftService - list")
    const lifts = await Lift.find().populate([
      {
        path: "driver",
      },
      {
        path: "applications",
        populate: {
          path: "passenger",
          model: "User",
        },
      },
      {
        path: "car",
      },
    ])

    if (lifts.length === 0) {
      throw new Error("NoLiftFound")
    }
    return lifts
  }

  async listByCode(code) {
    logger.info("LiftService - listByCode")
    const lift = await Lift.findOne({ cl: code }).populate([
      {
        path: "driver",
      },
      {
        path: "applications",
        populate: {
          path: "passenger",
          model: "User",
        },
      },
      {
        path: "car",
      },
    ])

    if (!lift) {
      throw new Error("NoLiftFound")
    }
    return lift
  }

  async listByUsername(username) {
    logger.info("LiftService - listByUsername")
    const user = await User.findOne({ username: username })
    if (!user) {
      throw new Error("UserNotFound")
    }

    const lifts = await Lift.find({ driver: user }).populate([
      {
        path: "driver",
      },
      {
        path: "applications",
        populate: {
          path: "passenger",
          model: "User",
        },
      },
      {
        path: "car",
      },
    ])

    if (lifts.length === 0) {
      throw new Error("NoLiftsFound")
    }
    return lifts
  }

  async filterLifts(filters) {
    logger.info("LiftService - filterLifts")

    const query = {}
    const allowedFilters = [
      "cl",
      "status",
      "startPointDistrict",
      "startPointMunicipality",
      "startPointParish",
      "endPointDistrict",
      "endPointMunicipality",
      "endPointParish",
      "schedule",
      "driver",
      "providedSeats",
      "occupiedSeats",
      "passenger",
      "car",
      "scheduleYear",
      "scheduleMonth",
      "scheduleDay",
      "scheduleHour",
    ]

    const invalidFilters = Object.keys(filters).filter(
      (key) => !allowedFilters.includes(key)
    )

    if (invalidFilters.length > 0) {
      throw new Error("InvalidQuery")
    }

    if (filters.cl) query.cl = filters.cl
    if (filters.status) {
      const validStatuses = [
        "open",
        "ready",
        "inProgress",
        "finished",
        "closed",
        "canceled",
      ]
      if (!validStatuses.includes(filters.status))
        throw new Error("InvalidStatus")
      query.status = filters.status
    }
    if (filters.startPointDistrict)
      query["startPoint.district"] = filters.startPointDistrict
    if (filters.startPointMunicipality)
      query["startPoint.municipality"] = filters.startPointMunicipality
    if (filters.startPointParish)
      query["startPoint.parish"] = filters.startPointParish
    if (filters.endPointDistrict)
      query["endPoint.district"] = filters.endPointDistrict
    if (filters.endPointMunicipality)
      query["endPoint.municipality"] = filters.endPointMunicipality
    if (filters.endPointParish)
      query["endPoint.parish"] = filters.endPointParish
    if (filters.schedule) query.schedule = filters.schedule
    if (filters.providedSeats)
      query.providedSeats = Number(filters.providedSeats)

    const sort = filters.sort || { createdAt: -1 }

    const lifts = await Lift.find(query)
      .populate([
        {
          path: "driver",
        },
        {
          path: "applications",
          populate: {
            path: "passenger",
            model: "User",
          },
        },
        {
          path: "car",
        },
      ])
      .sort(sort)

    const filteredLifts = lifts.filter((lift) => {
      const scheduleDate = new Date(lift.schedule)
      if (filters.passenger) {
        return lift.applications.some((application) => {
          return (
            application.passenger &&
            application.passenger.username ===
              filters.passenger.toLowerCase().trim()
          )
        })
      }
      if (filters.driver && lift.driver.username !== filters.driver) {
        return false
      }
      if (filters.car && lift.car.cc !== filters.car) {
        return false
      }
      if (
        filters.scheduleYear &&
        scheduleDate.getFullYear() !== Number(filters.scheduleYear)
      ) {
        return false
      }
      if (
        filters.scheduleMonth &&
        scheduleDate.getMonth() + 1 !== Number(filters.scheduleMonth)
      ) {
        return false
      }
      if (
        filters.scheduleDay &&
        scheduleDate.getDate() !== Number(filters.scheduleDay)
      ) {
        return false
      }
      if (
        filters.scheduleHour &&
        scheduleDate.getHours() !== Number(filters.scheduleHour)
      ) {
        return false
      }
      return true
    })

    if (filteredLifts.length === 0) throw new Error("NoLiftFound")

    return filteredLifts
  }

  async updateStatus(code, status) {
    logger.info("LiftService - update")

    const lift = await Lift.findOne({ cl: code }).populate([
      {
        path: "driver",
      },
      {
        path: "applications",
        populate: {
          path: "passenger",
          model: "User",
        },
      },
      {
        path: "car",
      },
    ])

    if (!lift) {
      throw new Error("LiftNotFound")
    }

    const driverLifts = await Lift.find({
      driver: lift.driver,
      status: "inProgress",
    })

    const statusValidations = {
      inProgress: () => {
        if (lift.status !== "ready" && lift.status !== "open")
          throw new Error("LiftNotReady")
        if (lift.applications.length === 0)
          throw new Error("ApplicationNotFound")
        if (!lift.applications.some((app) => app.status === "ready"))
          throw new Error("PassengerNotReady")
        if (driverLifts.length !== 0)
          throw new Error("DriverAlreadyHasLiftInProgress")
      },
      finished: () => {
        if (lift.status !== "inProgress") throw new Error("LiftNotInProgress")
      },
      closed: async () => {
        if (lift.status !== "finished") throw new Error("LiftNotFinished")
        const hasPassengerRatings = lift.applications.some(
          (app) => app.receivedPassengerRating
        )
        if (lift.receivedDriverRatings.length === 0 || !hasPassengerRatings) {
          throw new Error("MissingRatings")
        }
        lift.status = "closed"
        await lift.save()
        await this.updateRatings(lift)
      },
      canceled: async () => {
        if (["inProgress", "finished", "closed"].includes(lift.status)) {
          throw new Error("InvalidStatusToCancel")
        }
        const applicationIds = lift.applications.map((app) => app.ca)

        await Application.updateMany(
          { ca: { $in: applicationIds } },
          { $set: { status: "rejected" } }
        )
      },
    }

    if (statusValidations[status]) {
      await statusValidations[status]()
    } else {
      throw new Error("InvalidStatus")
    }

    if (status !== "closed") {
      lift.status = status
      await lift.save()
    }
    return lift
  }

  async checkInProgress(username) {
    const lifts = await Lift.find().populate([
      {
        path: "driver",
      },
      {
        path: "applications",
        populate: {
          path: "passenger",
          model: "User",
        },
      },
      {
        path: "car",
      },
    ])

    if(lifts.length === 0) {
      throw new Error("LiftNotFound")
    }

    const filterInProgress = lifts.filter((lift) => lift.status !== "open" && lift.status !== "ready") 
    const filteredLifts = filterInProgress.filter((lift) => lift.driver.username === username || lift.applications.some((app) => app.passenger.username === username))
    
    if(filteredLifts.length > 0){
      return true
    } else {
      return false
    }
  }

  async driverOrPassenger(username) {
    const lifts = await Lift.find().populate([
      {
        path: "driver",
      },
      {
        path: "applications",
        populate: {
          path: "passenger",
          model: "User",
        },
      },
      {
        path: "car",
      },
    ])

    if(lifts.length === 0) {
      throw new Error("LiftNotFound")
    }

    const filterInProgress = lifts.filter((lift) => lift.status !== "open" && lift.status !== "ready") 
    const isDriver = filterInProgress.some(
      (lift) => lift.driver.username === username,
    );
    const isPassenger = lifts.some((lift) =>
      lift.applications?.some((app) => app.passenger?.username === username),
    );
    
    
    if(isDriver){
      return "driver"
    } else if(isPassenger) {
      return "passenger"
    } else {
      throw new Error("UserRoleNotFound")
    }
  }

  async loadDriverRating(cl, rating) {
    const lift = await Lift.findOne({ cl: cl }).populate([
      {
        path: "driver",
      },
      {
        path: "applications",
        populate: {
          path: "passenger",
          model: "User",
        },
      },
      {
        path: "car",
      },
    ])

    if (!lift) {
      throw new Error("LiftNotFound")
    }

    if (lift.status !== "finished") {
      throw new Error("LiftNotFinished")
    }

    const readyApplicationsCount = lift.applications.filter(
      (app) => app.status === "ready"
    ).length

    if (lift.receivedDriverRatings.length >= readyApplicationsCount) {
      throw new Error("MaxRatingsGiven")
    }

    lift.receivedDriverRatings.push(rating)
    await lift.save()
    return lift
  }

  async updateRatings(lift) {
    logger.info("LiftService - update ratings")
    const driver = lift.driver
    const driverRatings = await Lift.find({
      driver: driver._id,
      status: "closed",
    })
      .select("receivedDriverRatings")
      .lean()

    const allDriverRatings = driverRatings.flatMap(
      (l) => l.receivedDriverRatings
    )
    const ratingsIncludingInitial =
      allDriverRatings.length > 0 ? [5, ...allDriverRatings] : [5]

    const averageDriverRating =
      ratingsIncludingInitial.length > 0
        ? ratingsIncludingInitial.reduce((sum, rating) => sum + rating, 0) /
          ratingsIncludingInitial.length
        : driver.driverRating

    driver.driverRating = parseFloat(averageDriverRating.toFixed(2))

    await driver.save()

    const passengerUpdates = lift.applications.map(async (application) => {
      const passenger = application.passenger

      const liftWithApplications = await Lift.find()
        .populate({
          path: "applications",
          populate: {
            path: "passenger",
            model: "User",
          },
        })
        .lean()

      const relevantLifts = liftWithApplications.filter((lift) =>
        lift.applications.some(
          (app) =>
            app.passenger._id.toString() === passenger._id.toString() &&
            app.status === "ready"
        )
      )

      const allPassengerRatings = relevantLifts
        .flatMap((lift) =>
          lift.applications.map((app) => app.receivedPassengerRating)
        )
        .filter(Boolean)

      const ratingsIncludingInitialPassenger =
        allPassengerRatings.length > 0 ? [5, ...allPassengerRatings] : [5]

      const averagePassengerRating =
        ratingsIncludingInitialPassenger.length > 0
          ? ratingsIncludingInitialPassenger.reduce(
              (sum, rating) => sum + rating,
              0
            ) / ratingsIncludingInitialPassenger.length
          : passenger.passengerRating

      passenger.passengerRating = parseFloat(averagePassengerRating.toFixed(2))

      await passenger.save()
    })

    await Promise.all(passengerUpdates)
  }

  async update(code, data) {
    logger.info("LiftService - update")
    const {
      cl,
      driver,
      car,
      startPoint,
      endPoint,
      schedule,
      price,
      providedSeats,
    } = data

    const lift = await Lift.findOne({ cl: code })
    if (!lift) {
      throw new Error("LiftNotFound")
    }

    if (
      JSON.stringify(data.startPoint) !== JSON.stringify(lift.startPoint) ||
      JSON.stringify(data.endPoint) !== JSON.stringify(lift.endPoint)
    ) {
      const fullStartLocation = `${data.startPoint.district}/${data.startPoint.municipality}/${data.startPoint.parish}`
      const fullEndLocation = `${data.endPoint.district}/${data.endPoint.municipality}/${data.endPoint.parish}`
      if (fullStartLocation === fullEndLocation) {
        throw new Error("MatchingLocations")
      }

      const isValidStart = await this.getGeoValidation(data.startPoint)

      const isValidEnd = await this.getGeoValidation(data.endPoint)

      if (!(isValidStart && isValidEnd)) {
        throw new Error("InvalidLocation")
      }
    }

    lift.cl = cl
    lift.driver = driver
    lift.car = car
    lift.startPoint = startPoint
    lift.endPoint = endPoint
    lift.schedule = schedule
    lift.price = price
    lift.providedSeats = providedSeats

    await lift.save()

    return lift.populate([
      {
        path: "driver",
      },
      {
        path: "applications",
        populate: {
          path: "passenger",
          model: "User",
        },
      },
      {
        path: "car",
      },
    ])
  }

  async delete(cl) {
    logger.info("LiftService - delete")
    const lift = Lift.findOne({ cl: cl })
    if (!lift) {
      throw new Error("LiftNotFound")
    }

    const application = Application.findOne({ lift: lift._id })
    if (application) {
      throw new Error("ApplicationAssociated")
    }
    await lift.deleteOne()
  }
}

export default new LiftService()
