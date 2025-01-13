import ApplicationService from "../services/applicationService.js";
import ApplicationInputDTO from "../DTO/applicationInputDTO.js";
import ApplicationOutputDTO from "../DTO/applicationOutputDTO.js";
import logger from "../logger.js";
import { MESSAGES } from "../utils/responseMessages.js";

class ApplicationController {
  //TODO criar validação para não deixar criar application se o status da lift não for XXXX
  //TODO acertar as mensagens de erro
  //TODO acrescentar outras validações
  
  async createApplication(req, res) {
    logger.info("POST: /api/applications");
    try {
      const {
        ca, passenger, lift
      } = req.body;
      const inputDTO = new ApplicationInputDTO({
        ca, passenger, lift,
      });
      const applicationModel = await inputDTO.toApplication();
      const savedApplication = await ApplicationService.create(applicationModel);
      console.log("oi", applicationModel)
      const outputDTO = new ApplicationOutputDTO(savedApplication);
      res.status(201).json({ message: 'Application created successfully!', data: outputDTO });
    } catch (err) {
      logger.error("LiftController - Error creating application", err.message);
      if (err.name === "ValidationError") {
        let errorMessage = `${MESSAGES.VALIDATION_ERROR}: `;
        for (let field in err.errors) {
          errorMessage += `${err.errors[field].message}`;
        }
        res
          .status(400)
          .json({ message: errorMessage.trim(), error: err.message });
      } else if (err.message === "MissingRequiredFields") {
        res.status(400).json({ error: MESSAGES.MISSING_REQUIRED_FIELDS });
      } else if (err.message === "DriverNotFound") {
        res.status(400).json({
          error: MESSAGES.DRIVER_NOT_FOUND_BY_CODE,
        });
      } else if (err.message === "CarNotFound") {
        res.status(400).json({
          error: MESSAGES.CAR_NOT_FOUND_BY_CODE,
        });
      } else if (err.code === 11000) {
        res.status(400).json({
          error: 'Duplicate application code.',
        });
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_TO_CREATE_LIFT });
      }
    }
  }
}

export default new ApplicationController();