import {} from "dotenv/config";
import UserService from "../services/userService.js";
import logger from "../logger.js";
import UserInputDTO from "../DTO/userInputDTO.js";
// import UserOutputDTO from "../DTO/userOutputDTO.js";
import { MESSAGES } from "../utils/responseMessages.js";

class UserController {
  registerAdmin = async (req, res) => {
    logger.info(`POST: /api/auth/register/admin`);
    try {
      const role = "admin";
      await this.register(req, res, role);
    } catch (err) {
      logger.error("UserController - Error registering admin - ", err);
    }
  };

  registerClient = async (req, res) => {
    logger.info(`POST: /api/auth/register/client`);
    try {
      const role = "client";
      await this.register(req, res, role);
    } catch (err) {
      logger.error("UserController - Error registering client - ", err);
    }
  };

  register = async (req, res, role) => {
    logger.info(`POST: /api/auth/register/${role}`);
    const { email, password, username } = req.body;
    try {
      const inputDTO = new UserInputDTO(req.body);
      const user = await inputDTO.toUser();
      const emailExists = await UserService.checkEmailAlreadyExists(user.email);
      const usernameExists = await UserService.checkUsernameAlreadyExists(
        user.username
      );
      if (emailExists || usernameExists) {
        res.status(400).json({ error: MESSAGES.DUPLICATE_EMAIL_OR_USERNAME });
      } else {
        await UserService.saveUserMongo(user, role);
        await UserService.saveUserSQL(email, username, password, role).catch(
          (err) => {
            logger.error(`Error saving ${role} in SQLite:`, err);
            throw err;
          }
        );
        res.status(201).json({ message: role + " " + "registado com sucesso" });
      }
    } catch (err) {
      logger.error(
        `UserController - Error registering ${role} - `,
        err.message
      );
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: ";
        for (const field in err.errors) {
          errorMessage += `${err.errors[field].message} `;
        }
        res.status(400).json({ error: errorMessage.trim() });
      } else if (err.code === 11000) {
        res.status(400).json({
          error: "Duplicate value",
        });
      } else if (err.message === "MissingRequiredFields") {
        res.status(400).json({
          error: MESSAGES.MISSING_REQUIRED_FIELDS,
        });
      } else {
        res.status(500).json({
          error: MESSAGES.REGISTER_FAILED + " " + role,
          details: err,
        });
      }
    }
  };
}
export default new UserController();
