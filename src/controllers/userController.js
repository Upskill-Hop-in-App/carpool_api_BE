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
      const emailExists = await UserService.checkEmailExists(user.email);
      const usernameExists = await UserService.checkUsernameExists(
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
        res
          .status(201)
          .json({ message: role + " " + "registered successfully" });
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
          error: MESSAGES.DUPLICATE_EMAIL_OR_USERNAME,
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

  update = async (req, res) => {
    logger.info(`PUT: /api/auth/profile/${req.params.username}`);
    try {
      let password;
      const usernameExists = await UserService.checkUsernameExists(
        req.params.username
      );
      if (usernameExists) {
        password = usernameExists.password;
      } else {
        res.status(404).json({ error: MESSAGES.USER_NOT_FOUND });
        return;
      }
      const inputDTO = new UserInputDTO(req.body);
      const user = await inputDTO.toUser();
      await UserService.updateUserMongo(req.params.username, user);
      await UserService.updateUserSQL(
        req.params.username,
        password,
        user
      ).catch((err) => {
        logger.error(`Error updating user in SQLite:`, err);
        throw err;
      });
      res.status(201).json({ message: MESSAGES.USER_UPDATED_SUCCESS });
    } catch (err) {
      logger.error(`Error updating user:`, err.message);
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: ";
        for (const field in err.errors) {
          errorMessage += `${err.errors[field].message} `;
        }
        res.status(400).json({ error: errorMessage.trim() });
      } else if (err.code === 11000) {
        res.status(400).json({
          error: MESSAGES.DUPLICATE_EMAIL_OR_USERNAME,
        });
      } else if (err.message === "MissingRequiredFields") {
        res.status(400).json({
          error: MESSAGES.MISSING_REQUIRED_FIELDS,
        });
      } else {
        res.status(500).json({
          error: MESSAGES.ERROR_UPDATING_USER,
          details: err,
        });
      }
    }
  };
}
export default new UserController();
