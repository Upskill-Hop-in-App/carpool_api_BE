import Lift from "../models/liftModel.js"
import User from "../models/userModel.js"
import Car from "../models/carModel.js"
import Application from "../models/applicationModel.js"
import logger from "../logger.js"
import axios from "axios"

class LiftService {
  async create(lift) {
    logger.info("LiftService - create")

    const fullStartLocation = `${lift.startPoint.district}/${lift.startPoint.municipality}/${lift.startPoint.parish}`;
    
    const fullEndLocation = `${lift.endPoint.district}/${lift.endPoint.municipality}/${lift.endPoint.parish}`;

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
      logger.debug("LiftService - getGeoValidation - err", err)
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
      occupiedSeats,
    } = data

    const lift = await Lift.findOne({ cl: code })
    if (!lift) {
      throw new Error("LiftNotFound")
    }

    const driverDoc = await User.findOne({ _id: driver })
    if (!driverDoc && driver !== undefined) {
      throw new Error("DriverNotFound")
    }

    const carDoc = await Car.findOne({ _id: car })
    if (!carDoc && car !== undefined) {
      throw new Error("CarNotFound")
    }

    Object.assign(lift, data)
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
