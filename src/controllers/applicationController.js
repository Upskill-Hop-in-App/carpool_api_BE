import ApplicationService from "../services/applicationService.js"
import ApplicationInputDTO from "../DTO/applicationInputDTO.js"
import ApplicationOutputDTO from "../DTO/applicationOutputDTO.js"
import logger from "../logger.js"
import { MESSAGES } from "../utils/responseMessages.js"

class ApplicationController {
  //TODO criar validação para não deixar criar application se o status da lift não for XXXX
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
      res.status(201).json({
        message: MESSAGES.APPLICATION_CREATED_SUCCESS,
        data: outputDTO,
      })
    } catch (err) {
      logger.error("LiftController - Error creating application", err)
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
      } else if (err.message === "LiftIsFull") {
        res.status(400).json({
          error: MESSAGES.LIFT_IS_FULL,
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

  async getAllApplications(req, res) {
    logger.info("GET: /api/applications")
    try {
      const applications = await ApplicationService.list()
      const outputDTOs = applications.map(
        (application) => new ApplicationOutputDTO(application)
      )
      res.status(200).json({
        message: MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS,
        data: outputDTOs,
      })
    } catch (err) {
      logger.error(
        "ApplicationController - Failed to retrieve applications: ",
        err
      )
      if (err.message === "NoApplicationFound") {
        res.status(404).json({ error: MESSAGES.NO_APPLICATIONS_FOUND })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_RETRIEVE_APPLICATION })
      }
    }
  }

  async getApplicationByCode(req, res) {
    logger.info(`GET:/api/applications/ca/${req.params.ca} `)
    try {
      const application = await ApplicationService.listByCode(req.params.ca)
      const outputDTO = new ApplicationOutputDTO(application)
      res.status(200).json({
        message: MESSAGES.APPLICATION_RETRIEVED_BY_CODE,
        data: outputDTO,
      })
    } catch (err) {
      logger.error(
        "ApplicationController - Failed to retrieve application by code: ",
        err
      )
      if (err.message === "ApplicationNotFound") {
        res.status(404).json({ error: MESSAGES.APPLICATION_NOT_FOUND })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_RETRIEVE_APPLICATION })
      }
    }
  }

  async getApplicationsByUsername(req, res) {
    logger.info(`GET: /api/applications/username/${req.params.username}`)
    try {
      const applications = await ApplicationService.listByPassenger(
        "username",
        req.params.username
      )
      const outputDTOs = applications.map(
        (application) => new ApplicationOutputDTO(application)
      )
      res.status(200).json({
        message: MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS,
        data: outputDTOs,
      })
    } catch (err) {
      logger.error(
        "ApplicationController - Failed to retrieve applications: ",
        err
      )
      if (err.message === "UserNotFound") {
        res.status(404).json({ error: MESSAGES.USER_NOT_FOUND })
      } else if (err.message === "NoApplicationFound") {
        res.status(400).json({ error: MESSAGES.NO_APPLICATIONS_FOUND })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_RETRIEVE_APPLICATION })
      }
    }
  }

  async getApplicationsByEmail(req, res) {
    logger.info(`GET: /api/applications/email/${req.params.email}`)
    try {
      const applications = await ApplicationService.listByPassenger(
        "email",
        req.params.email
      )
      const outputDTOs = applications.map(
        (application) => new ApplicationOutputDTO(application)
      )
      res.status(200).json({
        message: MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS,
        data: outputDTOs,
      })
    } catch (err) {
      logger.error(
        "ApplicationController - Failed to retrieve applications: ",
        err.message
      )
      if (err.message === "UserNotFound") {
        res.status(404).json({ error: MESSAGES.USER_NOT_FOUND })
      } else if (err.message === "NoApplicationFound") {
        res.status(400).json({ error: MESSAGES.NO_APPLICATIONS_FOUND })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_RETRIEVE_APPLICATION })
      }
    }
  }

  async getApplicationsByStatus(req, res) {
    logger.info(`GET: /api/applications/status/${req.params.status}`)
    try {
      const applications = await ApplicationService.listByStatus(
        req.params.status
      )
      const outputDTOs = applications.map(
        (application) => new ApplicationOutputDTO(application)
      )
      res.status(200).json({
        message: MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS,
        data: outputDTOs,
      })
    } catch (err) {
      logger.error(
        "ApplicationController - Failed to retrieve applications: ",
        err.message
      )
      if (err.message === "InvalidStatus") {
        res.status(400).json({ error: MESSAGES.INVALID_STATUS })
      } else if (err.message === "NoApplicationFound") {
        res.status(400).json({ error: MESSAGES.NO_APPLICATIONS_FOUND })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_RETRIEVE_APPLICATION })
      }
    }
  }

  async getApplicationsByUsernameAndStatus(req, res) {
    logger.info(
      `GET: /api/applications/username/status/${req.params.username}/${req.params.status}`
    )
    try {
      const applications = await ApplicationService.listByPassengerAndStatus(
        "username",
        req.params.username,
        req.params.status
      )
      const outputDTOs = applications.map(
        (application) => new ApplicationOutputDTO(application)
      )
      res.status(200).json({
        message: MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS,
        data: outputDTOs,
      })
    } catch (err) {
      logger.error(
        "ApplicationController - Failed to retrieve applications: ",
        err
      )
      if (err.message === "UserNotFound") {
        res.status(404).json({ error: MESSAGES.USER_NOT_FOUND })
      } else if (err.message === "InvalidStatus") {
        res.status(400).json({ error: MESSAGES.INVALID_STATUS })
      } else if (err.message === "NoApplicationFound") {
        res.status(400).json({ error: MESSAGES.NO_APPLICATIONS_FOUND })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_RETRIEVE_APPLICATION })
      }
    }
  }

  async getApplicationsByEmailAndStatus(req, res) {
    logger.info(
      `GET: /api/applications/email/status/${req.params.email}/${req.params.status}`
    )
    try {
      const applications = await ApplicationService.listByPassengerAndStatus(
        "email",
        req.params.email,
        req.params.status
      )
      const outputDTOs = applications.map(
        (application) => new ApplicationOutputDTO(application)
      )
      res.status(200).json({
        message: MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS,
        data: outputDTOs,
      })
    } catch (err) {
      logger.error(
        "ApplicationController - Failed to retrieve applications: ",
        err.message
      )
      if (err.message === "UserNotFound") {
        res.status(404).json({ error: MESSAGES.USER_NOT_FOUND })
      } else if (err.message === "InvalidStatus") {
        res.status(400).json({ error: MESSAGES.INVALID_STATUS })
      } else if (err.message === "NoApplicationFound") {
        res.status(400).json({ error: MESSAGES.NO_APPLICATIONS_FOUND })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_RETRIEVE_APPLICATION })
      }
    }
  }

  async filterApplications(req, res) {
    try {
      logger.info(`GET:/api/applications/filter/${req.query}`)

      const filters = req.query
      const applications = await ApplicationService.filterApplications(filters)
      const outputDTO = applications.map((app) => new ApplicationOutputDTO(app))
      res.status(200).json({
        message: MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS,
        data: outputDTO,
      })
    } catch (err) {
      logger.error(
        "ApplicationController - Failed to filter applications:",
        err
      )
      if (err.message === "NoApplicationFound") {
        res.status(404).json({ error: MESSAGES.NO_APPLICATIONS_FOUND })
      } else if (err.message === "InvalidStatus") {
        res.status(400).json({ error: MESSAGES.INVALID_STATUS })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_RETRIEVE_APPLICATION })
      }
    }
  }

  async filterApplicationsByUsername(req, res) {
    try {
      logger.info(`GET:/api/applications/filter/${req.params.username}`)

      const username = req.params.username
      const filters = req.query

      const applications =
        await ApplicationService.filterApplicationsByUsername(username, filters)

      const outputDTO = applications.map((app) => new ApplicationOutputDTO(app))
      res.status(200).json({
        message: MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS,
        data: outputDTO,
      })
    } catch (err) {
      logger.error(
        "ApplicationController - Failed to filter applications by username",
        err
      )
      if (err.message === "NoApplicationFound") {
        res.status(404).json({ error: MESSAGES.NO_APPLICATIONS_FOUND })
      } else if (err.message === "UserNotFound") {
        res.status(400).json({ error: MESSAGES.USER_NOT_FOUND })
      } else if (err.message === "InvalidStatus") {
        res.status(400).json({ error: MESSAGES.INVALID_STATUS })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_RETRIEVE_APPLICATION })
      }
    }
  }

  async accept(req, res) {
    try {
      logger.info(`PUT: /api/applications/accept/${req.params.ca}`)
      await ApplicationService.acceptApplication(req.params.ca)
      res.status(200).json({ message: MESSAGES.APPLICATION_ACCEPTED_SUCCESS })
    } catch (err) {
      logger.error("applicationController - acceptApplication", err)
      if (err.message === "ApplicationNotFound") {
        res.status(400).json({ error: MESSAGES.APPLICATION_NOT_FOUND })
      } else if (err.message === "StatusNotPending") {
        res.status(400).json({ error: MESSAGES.STATUS_NOT_PENDING })
      } else if (err.message === "LiftNotFound") {
        res.status(400).json({ error: MESSAGES.LIFT_NOT_FOUND })
      } else if (err.message === "LiftIsFull") {
        res.status(400).json({ error: MESSAGES.LIFT_IS_FULL })
      } else if (err.message === "LiftNotOpen") {
        res
          .status(400)
          .json({ error: MESSAGES.LIFT_NOT_ACCEPTING_APPLICATIONS })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_ACCEPT_APPLICATION })
      }
    }
  }

  async reject(req, res) {
    try {
      logger.info(`PUT: /api/applications/reject/${req.params.ca}`)
      await ApplicationService.rejectApplication(req.params.ca)
      res.status(200).json({ message: MESSAGES.APPLICATION_REJECTED_SUCCESS })
    } catch (err) {
      logger.error("applicationController - rejectApplication", err)
      if (err.message === "ApplicationNotFound") {
        res.status(400).json({ error: MESSAGES.APPLICATION_NOT_FOUND })
      } else if (err.message === "StatusNotPending") {
        res.status(400).json({ error: MESSAGES.STATUS_NOT_PENDING })
      } else if (err.message === "LiftNotFound") {
        res.status(400).json({ error: MESSAGES.LIFT_NOT_FOUND })
      } else if (err.message === "LiftNotOpen") {
        res
          .status(400)
          .json({ error: MESSAGES.LIFT_NOT_ACCEPTING_APPLICATIONS })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_ACCEPT_APPLICATION })
      }
    }
  }

  async cancel(req, res) {
    try {
      logger.info(`PUT: /api/applications/cancel/${req.params.ca}`)
      await ApplicationService.cancelApplication(req.params.ca)
      res.status(200).json({ message: MESSAGES.APPLICATION_CANCELED_SUCCESS })
    } catch (err) {
      logger.error("applicationController - cancelApplication", err)
      if (err.message === "ApplicationNotFound") {
        res.status(400).json({ error: MESSAGES.APPLICATION_NOT_FOUND })
      } else if (err.message === "LiftAlreadyStartedOrCanceled") {
        res.status(400).json({ error: MESSAGES.LIFT_STARTED_OR_CANCELED })
      } else if (err.message === "LiftNotFound") {
        res.status(400).json({ error: MESSAGES.LIFT_NOT_FOUND })
      } else if (err.message === "ApplicationRejectedCanceled") {
        res
          .status(400)
          .json({ error: MESSAGES.APPLICATION_ALREADY_REJECTED_CANCELED })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_CANCEL_APPLICATION })
      }
    }
  }

  async delete(req, res) {
    try {
      logger.info(`DELETE: /api/applications/${req.params.ca}`)
      await ApplicationService.delete(req.params.ca)
      res.status(200).json({ message: MESSAGES.APPLICATION_DELETED_SUCCESS })
    } catch (err) {
      if (err.message === "ApplicationNotFound") {
        res.status(400).json({ error: MESSAGES.APPLICATION_NOT_FOUND })
      } else if (err.message === "LifNotFound") {
        res.status(400).json({ error: MESSAGES.LIFT_NOT_FOUND })
      } else if (err.message === "LiftAlreadyStartedOrCanceled") {
        res.status(400).json({ error: MESSAGES.LIFT_STARTED_OR_CANCELED })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_DELETE_APPLICATION })
      }
    }
  }
}

export default new ApplicationController()
