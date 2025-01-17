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
