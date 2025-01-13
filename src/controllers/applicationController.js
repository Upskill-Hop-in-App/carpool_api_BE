import ApplicationService from "../services/applicationService.js"
import ApplicationInputDTO from "../DTO/applicationInputDTO.js"
import ApplicationOutputDTO from "../DTO/applicationOutputDTO.js"
import logger from "../logger.js"
import { MESSAGES } from "../utils/responseMessages.js"

class ApplicationController {
  //TODO criar validação para não deixar criar application se o status da lift não for XXXX
  //TODO acertar as mensagens de erro
  //TODO acrescentar outras validações

  async createApplication(req, res) {
    logger.info("POST: /api/applications")
    try {
      const { ca, passenger, lift } = req.body
      const inputDTO = new ApplicationInputDTO({
        ca,
        passenger,
        lift,
      })
      const applicationModel = await inputDTO.toApplication()
      const savedApplication = await ApplicationService.create(applicationModel)
      const outputDTO = new ApplicationOutputDTO(savedApplication)
      res
        .status(201)
        .json({
          message: MESSAGES.APPLICATION_CREATED_SUCCESS,
          data: outputDTO,
        })
    } catch (err) {
      logger.error("LiftController - Error creating application", err.message)
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
      } else if (err.message === "PassengerNotFound") {
        res.status(400).json({
          error: MESSAGES.PASSENGER_NOT_FOUND,
        })
      } else if (err.message === "LiftNotFound") {
        res.status(400).json({
          error: MESSAGES.LIFT_NOT_FOUND_BY_CODE,
        })
      } else if (err.message === "ApplicationAlreadyExists") {
        res.status(400).json({
          error: MESSAGES.DUPLICATE_APPLICATION,
        })
      } else if (err.message === "LiftStatusNotOpen") {
        res.status(400).json({
          error: MESSAGES.LIFT_STATUS_NOT_OPEN,
        })
      } else if (err.code === 11000) {
        res.status(400).json({
          error: MESSAGES.DUPLICATE_CA,
        })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_CREATE_APPLICATION })
      }
    }
  }
}

export default new ApplicationController()
