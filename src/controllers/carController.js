import CarService from "../services/carService.js"
import CarInputDTO from "../DTO/carInputDTO.js"
import CarOutputDTO from "../DTO/carOutputDTO.js"
import logger from "../logger.js"
import { MESSAGES } from "../utils/responseMessages.js"
class CarController {
  async createCar(req, res) {
    logger.info("POST: /api/cars")
    try {
      const { brand, model, year, user, color, plate } = req.body
      const inputDTO = new CarInputDTO({
        brand,
        model,
        year,
        user,
        color,
        plate,
      })
      logger.debug("CarController - createCar - inputDTO")
      const carModel = await inputDTO.toCar()
      const savedCar = await CarService.create(carModel, req)
      const outputDTO = new CarOutputDTO(savedCar)
      res.status(201).json({ message: MESSAGES.CAR_CREATED, data: outputDTO })
    } catch (err) {
      logger.error("CarController - Error creating car", err)
      if (err.name === "ValidationError") {
        let errorMessage = `${MESSAGES.VALIDATION_ERROR}: `
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message}`
        }
        res
          .status(400)
          .json({ message: errorMessage.trim(), error: err.message })
      } else if (err.message === "MissingRequiredFields") {
        res.status(400).json({ error: MESSAGES.MISSING_REQUIRED_FIELDS })
      } else if (err.message === "DriverNotFound") {
        res.status(400).json({ error: MESSAGES.DRIVER_NOT_FOUND })
      } else if (err.message === "CarNotValid") {
        res.status(400).json({ error: MESSAGES.INVALID_CAR })
      } else if (err.code === 11000) {
        res.status(400).json({
          error: MESSAGES.DUPLICATE_CAR,
        })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_CREATE_CAR })
      }
    }
  }

  async getCarByUsername(req, res) {
    logger.info("GET:/api/cars by Username: " + req.params.username)
    try {
      const cars = await CarService.listByUsername(req.params.username)
      const outputDTOs = cars.map((car) => new CarOutputDTO(car))
      res
        .status(200)
        .json({ message: MESSAGES.CARS_RETRIEVED, data: outputDTOs })
    } catch (err) {
      logger.error("CarController - Failed to retrieve car by username")
      if (err.message === "UserNotFound") {
        res.status(404).json({ error: MESSAGES.USER_NOT_FOUND })
      } else if (err.message === "NoCarsFound") {
        res.status(404).json({ error: MESSAGES.NO_CARS_FOUND })
      } else {
        res
          .status(500)
          .json({ error: MESSAGES.FAILED_TO_RETRIEVE_CAR_BY_USERNAME })
      }
    }
  }

  async filterCars(req, res) {
    try {
      logger.info(`GET:/api/cars/filter/username/${req.query}`)

      const filters = req.query

      const cars = await CarService.filterCars(filters)
      const outputDTO = cars.map((car) => new CarOutputDTO(car))
      res.status(200).json({
        message: MESSAGES.CARS_RETRIEVED,
        data: outputDTO,
      })
    } catch (err) {
      logger.error("CarController - Failed to filter cars:", err)
      if (err.message === "NoLiftFound") {
        res.status(404).json({ error: MESSAGES.NO_CARS_FOUND })
      } else if (err.message === "InvalidStatus") {
        res.status(400).json({ error: MESSAGES.INVALID_STATUS })
      } else if (err.message === "InvalidQuery") {
        res.status(400).json({ error: MESSAGES.INVALID_QUERY_CARS })
      } else if (err.message === "UserNotFound") {
        res.status(400).json({ error: MESSAGES.USER_NOT_FOUND })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_RETRIEVE_CARS })
      }
    }
  }

  async updateCarByCode(req, res) {
    logger.info("PUT: /api/cars")
    try {
      const { brand, model, year, user, color, plate } = req.body
      const inputDTO = new CarInputDTO({
        brand,
        model,
        year,
        user,
        color,
        plate,
      })
      const carModel = await inputDTO.toCar()
      const car = await CarService.update(req.params.cc, carModel)
      const outputDTO = new CarOutputDTO(car)
      res.status(200).json({ message: MESSAGES.CAR_UPDATED, data: outputDTO })
    } catch (err) {
      logger.error("CarController - Error updating car")
      if (err.name === "ValidationError") {
        let errorMessage = `${MESSAGES.VALIDATION_ERROR}: `
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message}`
        }
        res
          .status(400)
          .json({ message: errorMessage.trim(), error: err.message })
      } else if (err.message === "MissingRequiredFields") {
        res.status(400).json({
          error: MESSAGES.MISSING_REQUIRED_FIELDS,
        })
      } else if (err.message === "CarNotFound") {
        res.status(400).json({ error: MESSAGES.CAR_NOT_FOUND_BY_CODE })
      } else if (err.code === 11000) {
        res.status(400).json({
          error: MESSAGES.DUPLICATE_CAR,
        })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_UPDATE_CAR })
      }
    }
  }

  async deleteCarByCode(req, res) {
    logger.info("DELETE:/api/cars: " + req.params.cc)
    try {
      await CarService.delete(req.params.cc)
      res
        .status(200)
        .json({ message: MESSAGES.CAR_DELETED, data: req.params.cc })
    } catch (err) {
      logger.error("CarController - Error deleting car")
      if (err.message === "CarNotFound") {
        res.status(400).json({ error: MESSAGES.CAR_NOT_FOUND_BY_CODE })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_DELETE_CAR })
      }
    }
  }
}

export default new CarController()
