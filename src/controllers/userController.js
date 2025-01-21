import {} from "dotenv/config"
import UserService from "../services/userService.js"
import logger from "../logger.js"
import UserInputDTO from "../DTO/userInputDTO.js"
import UserOutputDTO from "../DTO/userOutputDTO.js"
import { MESSAGES } from "../utils/responseMessages.js"

class UserController {
  registerAdmin = async (req, res) => {
    logger.info(`POST: /api/auth/register/admin`)
    try {
      const role = "admin"
      await this.register(req, res, role)
    } catch (err) {
      logger.error("UserController - Error registering admin - ", err)
    }
  }

  registerClient = async (req, res) => {
    logger.info(`POST: /api/auth/register/client`)
    try {
      const role = "client"
      await this.register(req, res, role)
    } catch (err) {
      logger.error("UserController - Error registering client - ", err)
    }
  }

  register = async (req, res, role) => {
    logger.info(`POST: /api/auth/register/${role}`)
    const { email, password, username } = req.body
    try {
      const inputDTO = new UserInputDTO(req.body)
      const user = await inputDTO.toUser(role)
      const emailExists = await UserService.checkEmailExists(user.email)
      const usernameExists = await UserService.checkUsernameExists(
        user.username
      )

      if (emailExists || usernameExists) {
        res.status(400).json({ error: MESSAGES.DUPLICATE_EMAIL_OR_USERNAME })
      } else {
        const saveMongo = UserService.saveUserMongo(user)
        const saveSQL = UserService.saveUserSQL(
          email,
          username,
          password,
          role
        ).catch((err) => {
          logger.error(`Error saving ${role} in SQLite:`, err)
          throw err
        })

        await Promise.all([saveMongo, saveSQL])

        res.status(201).json({ message: MESSAGES.REGISTER_SUCCESS })
      }
    } catch (err) {
      logger.error(`UserController - Error registering ${role} - `, err)

      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: "
        for (const field in err.errors) {
          errorMessage += `${err.errors[field].message} `
        }
        res.status(400).json({ error: errorMessage.trim() })
      } else if (err.code === 11000) {
        res.status(400).json({ error: MESSAGES.DUPLICATE_EMAIL_OR_USERNAME })
      } else if (err.message === "MissingRequiredFields") {
        res.status(400).json({ error: MESSAGES.MISSING_REQUIRED_FIELDS })
      } else {
        res.status(500).json({
          error: MESSAGES.REGISTER_FAILED + " " + role,
          details: err,
        })
      }
    }
  }

  login = async (req, res) => {
    logger.info(`POST: /api/auth/login`)
    const { email, password } = req.body

    try {
      const token = await UserService.validateLogin(email, password)
      res
        .status(200)
        .json({ message: MESSAGES.LOGIN_SUCCESS, userToken: token })
    } catch (err) {
      logger.error("Error logging in: ", err)

      if (err.message === "MissingRequiredFields") {
        res.status(404).json({ error: MESSAGES.MISSING_REQUIRED_FIELDS })
      }

      if (err.message === "UserNotFound") {
        res.status(404).json({ error: MESSAGES.USER_EMAIL_NOT_FOUND })
      }

      if (err.message === "IncorrectUserOrPassword") {
        res.status(400).json({ error: MESSAGES.INCORRECT_USER_OR_PASSWORD })
      }
    }
  }

  getUserByUsername = async (req, res) => {
    logger.info(`GET: /api/auth/username/${req.params.username}`)
    try {
      const user = await UserService.findUserByUsernameMongo(
        req.params.username
      )
      const outputDTO = new UserOutputDTO(user)
      res.status(200).json({
        message: MESSAGES.USER_RETRIEVED_SUCCESS,
        data: outputDTO,
      })
    } catch (err) {
      if (err.message === "UserNotFound") {
        res.status(404).json({ error: MESSAGES.USER_NOT_FOUND })
      } else {
        res.status(500).json({ error: MESSAGES.FAILED_RETRIEVING_USER })
      }
    }
  }

  update = async (req, res) => {
    logger.info(`PUT: /api/auth/profile/${req.params.username}`)
    try {
      let password
      const usernameExists = await UserService.checkUsernameExists(
        req.params.username
      )
      if (usernameExists) {
        password = usernameExists.password
      } else {
        res.status(404).json({ error: MESSAGES.USER_EMAIL_NOT_FOUND })
        return
      }
      const updates = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        contact: req.body.contact,
        password: password,
      }
      const inputDTO = new UserInputDTO(updates)
      const user = await inputDTO.toUser()
      const updateMongo = UserService.updateUserMongo(req.params.username, user)
      const updateSQL = UserService.updateUserSQL(
        req.params.username,
        password,
        user
      ).catch((err) => {
        logger.error(`Error updating user in SQLite:`, err)
        throw err
      })
      await Promise.all([updateMongo, updateSQL])
      res.status(201).json({ message: MESSAGES.USER_UPDATED_SUCCESS })
    } catch (err) {
      logger.error(`Error updating user:`, err)
      if (err.name === "ValidationError") {
        let errorMessage = "Validation Error: "
        for (const field in err.errors) {
          errorMessage += `${err.errors[field].message} `
        }
        res.status(400).json({ error: errorMessage.trim() })
      } else if (err.code === 11000) {
        res.status(400).json({
          error: MESSAGES.DUPLICATE_EMAIL_OR_USERNAME,
        })
      } else if (err.message === "MissingRequiredFields") {
        res.status(400).json({
          error: MESSAGES.MISSING_REQUIRED_FIELDS,
        })
      } else {
        res.status(500).json({
          error: MESSAGES.ERROR_UPDATING_USER,
          details: err,
        })
      }
    }
  }

  updatePassword = async (req, res) => {
    logger.info(`PUT: /api/auth/password/${req.params.username}`)
    try {
      const username = req.params.username
      const { password } = req.body

      if (!password || password.trim() === "") {
        res.status(400).json({ error: MESSAGES.PASSWORD_EMPTY })
        return
      }

      const usernameExists = await UserService.checkUsernameExists(username)
      if (!usernameExists) {
        res.status(404).json({ error: MESSAGES.USER_EMAIL_NOT_FOUND })
        return
      }

      await UserService.updatePassword(username, password)
      res.status(200).json({ message: MESSAGES.PASSWORD_UPDATED_SUCCESS })
    } catch (err) {
      logger.error(`Error updating password`, err)
      res.status(500).json({
        error: MESSAGES.ERROR_UPDATING_PASSWORD,
        details: err,
      })
    }
  }

  delete = async (req, res) => {
    logger.info(`DELETE: /api/auth/delete/${req.params.username}`)
    try {
      const username = req.params.username

      const userMongo = await UserService.findUserByUsernameMongo(username)
      if (!userMongo) {
        res.status(404).json({ error: MESSAGES.USER_EMAIL_NOT_FOUND })
        return
      }

      const userSQL = await UserService.checkUsernameExists(username)
      if (!userSQL) {
        res.status(404).json({ error: MESSAGES.USER_EMAIL_NOT_FOUND })
        return
      }

      const deleteMongo = UserService.deleteUserMongo(username)
      const deleteSQL = UserService.deleteUserSQL(username)

      await Promise.all([deleteMongo, deleteSQL])
      res.status(200).json({ message: MESSAGES.USER_DELETED_SUCCESS })
    } catch (err) {
      logger.error(`Error deleting user`, err)
      res.status(500).json({
        error: MESSAGES.ERROR_DELETING_USER,
        details: err.message,
      })
    }
  }

  delete = async (req, res) => {
    logger.info(`PUT: /api/auth/delete/${req.params.username}`)
    try {
      const username = req.params.username

      const userMongo = await UserService.findUserByUsernameMongo(username)
      if (!userMongo) {
        res.status(404).json({ error: MESSAGES.USER_NOT_FOUND })
        return
      }

      const userSQL = await UserService.checkUsernameExists(username)
      if (!userSQL) {
        res.status(404).json({ error: MESSAGES.USER_NOT_FOUND })
        return
      }

      const anonymUser = await UserService.deleteUser(userMongo)

      res
        .status(200)
        .json({ message: MESSAGES.USER_DELETED_SUCCESS, data: anonymUser })
    } catch (err) {
      logger.error(`Error deleting user`, err)
      if (err.message === "UserNotFound") {
        res.status(400).json({ error: MESSAGES.USER_NOT_FOUND })
      } else if (err.message === "UserAlreadyAnonym") {
        res.status(400).json({ error: MESSAGES.USER_ALREADY_ANONYM })
      } else {
        res.status(500).json({
          error: MESSAGES.ERROR_ANONYMIZING_USER,
          details: err.message,
        })
      }
    }
  }
}
export default new UserController()
