import LiftService from "../services/liftService.js"
import LiftInputDTO from "../DTO/liftInputDTO.js"
import LiftOutputDTO from "../DTO/liftOutputDTO.js"
import logger from "../logger.js"
import { MESSAGES } from "../utils/responseMessages.js"
class LiftController {
  async createLift(req, res) {
    logger.info("POST: /api/lifts")
    try {
      const {
        driver,
        car,
        startPoint,
        endPoint,
        schedule,
        price,
        providedSeats,
      } = req.body
      const inputDTO = new LiftInputDTO({
        driver,
        car,
        startPoint,
        endPoint,
        schedule,
        price,
        providedSeats,
      })
      const liftModel = await inputDTO.toLift()
      const savedLift = await LiftService.create(liftModel)
      const outputDTO = new LiftOutputDTO(savedLift)
      res.status(201).json({ message: MESSAGES.LIFT_CREATED, data: outputDTO })
    } catch (err) {
      logger.error("LiftController - Error creating lift: ", err)
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
        res.status(400).json({
          error: MESSAGES.DRIVER_NOT_FOUND_BY_CODE,
        })
      } else if (err.message === "CarNotFound") {
        res.status(400).json({
          error: MESSAGES.CAR_NOT_FOUND_BY_CODE,
        })
      } else if (err.code === 11000) {
        res.status(400).json({
          error: MESSAGES.DUPLICATE_LIFT,
        })
      } else if (err.message === "FailedCarValidation") {
        res.status(400).json({
          error: MESSAGES.FAILED_TO_RETRIEVE_VALIDATION_INFO,
        })
      } else if (err.message === "MatchingLocations") {
        res.status(400).json({
          error: MESSAGES.MATCHING_START_END,
        })
      } else if (err.message === "InvalidLocation") {
        res.status(400).json({
          error: MESSAGES.INVALID_LOCATION,
        })
      } else if (err.message === "InvalidDateFormat") {
        res.status(400).json({
          error: MESSAGES.INVALID_DATE_FORMAT,
        })
      } else if (err.message === "DateInPast") {
        res.status(400).json({
          error: MESSAGES.DATE_IN_PAST,
        })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_CREATE_LIFT })
      }
    }
  }

  async getAllLifts(req, res) {
    logger.info("GET:/api/lifts")
    try {
      const lifts = await LiftService.list()
      const outputDTOs = lifts.map((lift) => new LiftOutputDTO(lift))
      res
        .status(200)
        .json({ message: MESSAGES.LIFTS_RETRIEVED, data: outputDTOs })
    } catch (err) {
      logger.error("LiftController - Failed to retrieve lifts: ", err.message)
      if (err.message === "NoLiftFound") {
        res.status(404).json({ error: MESSAGES.NO_LIFTS_FOUND })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_RETRIEVE_LIFTS })
      }
    }
  }

  async getLiftByCode(req, res) {
    logger.info("GET:/api/lifts by Code: " + req.params.cl)
    try {
      const lift = await LiftService.listByCode(req.params.cl)
      const outputDTO = new LiftOutputDTO(lift)
      res.status(200).json({
        message: MESSAGES.LIFT_RETRIEVED_BY_CODE,
        data: outputDTO,
      })
    } catch (err) {
      logger.error(
        "LiftController - Failed to retrieve lift by code: ",
        err.message
      )
      if (err.message === "LiftNotFound") {
        res.status(404).json({ error: MESSAGES.LIFT_NOT_FOUND_BY_CODE })
      } else {
        res
          .status(500)
          .json({ error: MESSAGES.FAILED_TO_RETRIEVE_LIFT_BY_CODE })
      }
    }
  }

  async filterLifts(req, res) {
    try {
      logger.info(`GET:/api/lifts/filter/${req.query}`)

      const filters = req.query

      const lifts = await LiftService.filterLifts(filters)
      const outputDTO = lifts.map((lift) => new LiftOutputDTO(lift))
      res.status(200).json({
        message: MESSAGES.LIFTS_RETRIEVED,
        data: outputDTO,
      })
    } catch (err) {
      logger.error("LiftController - Failed to filter lifts:", err)
      if (err.message === "NoLiftFound") {
        res.status(404).json({ error: MESSAGES.NO_LIFTS_FOUND })
      } else if (err.message === "InvalidStatus") {
        res.status(400).json({ error: MESSAGES.INVALID_STATUS })
      } else if (err.message === "InvalidQuery") {
        res.status(400).json({ error: MESSAGES.INVALID_QUERY_LIFTS })
      } else if (err.message === "DriverNotFound") {
        res.status(400).json({ error: MESSAGES.DRIVER_NOT_FOUND })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_RETRIEVE_LIFTS })
      }
    }
  }

  async updateLiftByCode(req, res) {
    logger.info("PUT: /api/lifts")
    try {
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
      } = req.body
      const inputDTO = new LiftInputDTO({
        cl,
        driver,
        car,
        startPoint,
        endPoint,
        schedule,
        price,
        providedSeats,
        occupiedSeats,
      })
      const liftModel = await inputDTO.toLift()
      const lift = await LiftService.update(req.params.cl, liftModel)
      const outputDTO = new LiftOutputDTO(lift)
      res.status(200).json({ message: MESSAGES.LIFT_UPDATED, data: outputDTO })
    } catch (err) {
      logger.error("LiftController - Error updating lift: ", err)
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
      } else if (err.message === "LiftNotFound") {
        res.status(400).json({ error: MESSAGES.LIFT_NOT_FOUND_BY_CODE })
      } else if (err.message === "DriverNotFound") {
        res.status(400).json({ error: MESSAGES.DRIVER_NOT_FOUND_BY_CODE })
      } else if (err.message === "CarNotFound") {
        res.status(400).json({ error: MESSAGES.CAR_NOT_FOUND_BY_CODE })
      } else if (err.code === 11000) {
        res.status(400).json({
          error: MESSAGES.DUPLICATE_LIFT,
        })
      } else if (err.message === "MatchingLocations") {
        res.status(400).json({
          error: MESSAGES.MATCHING_START_END,
        })
      } else if (err.message === "InvalidLocation") {
        res.status(400).json({
          error: MESSAGES.INVALID_LOCATION,
        })
      } else if (err.message === "InvalidDateFormat") {
        res.status(400).json({
          error: MESSAGES.INVALID_DATE_FORMAT,
        })
      } else if (err.message === "DateInPast") {
        res.status(400).json({
          error: MESSAGES.DATE_IN_PAST,
        })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_UPDATE_LIFT })
      }
    }
  }

  async deleteLiftByCode(req, res) {
    logger.info("DELETE:/api/lifts: " + req.params.cl)
    try {
      await LiftService.delete(req.params.cl)
      res
        .status(200)
        .json({ message: MESSAGES.LIFT_DELETED, data: req.params.cl })
    } catch (err) {
      logger.error("LiftController - Error deleting lift: ", err.message)
      if (err.message === "LiftNotFound") {
        res.status(400).json({ error: MESSAGES.LIFT_NOT_FOUND_BY_CODE })
      } else if (err.message === "ApplicationAssociated") {
        res.status(400).json({ error: MESSAGES.APPLICATION_ASSOCIATED })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_DELETE_LIFT })
      }
    }
  }
}

export default new LiftController()
