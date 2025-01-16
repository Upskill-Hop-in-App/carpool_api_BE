import {} from "dotenv/config"
import UserService from "../services/userService.js"
import logger from "../logger.js"
import UserInputDTO from "../DTO/userInputDTO.js"
import { MESSAGES } from "../utils/responseMessages.js"

class UserController {
  registerAdmin = async (req, res) => {
    logger.info(`POST: /api/auth/register/admin`)
    try {
      const role = "admin"
      await this.register(req, res, role)
    } catch (err) {
      logger.error("UserController - Error registering admin - ", err.message)
    }
  }

  registerClient = async (req, res) => {
    logger.info(`POST: /api/auth/register/client`)
    try {
      const role = "client"
      await this.register(req, res, role)
    } catch (err) {
      logger.error("UserController - Error registering client - ", err.message)
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
          logger.error(`Error saving ${role} in SQLite:`, err.message)
          throw err
        })

        await Promise.all([saveMongo, saveSQL])

        res.status(201).json({ message: MESSAGES.REGISTER_SUCCESS })
      }
    } catch (err) {
      logger.error(`UserController - Error registering ${role} - `, err.message)

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

    if (!email || !password) {
      logger.error("Login - missing required fields")
      throw new Error("MissingRequiredFields")
    }

    try {
      const token = await UserService.validateLogin(email, password)
      res
        .status(200)
        .json({ message: MESSAGES.LOGIN_SUCCESS, userToken: token })
    } catch (err) {
      logger.error("Error logging in: ", err)

      if (err.message === "UserNotFound") {
        res.status(404).json({ error: MESSAGES.USER_EMAIL_NOT_FOUND })
      }

      if (err.message === "IncorrectUserOrPassword") {
        res.status(400).json({ error: MESSAGES.INCORRECT_USER_OR_PASSWORD })
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
        logger.error(`Error updating user in SQLite:`, err.message)
        throw err
      })
      await Promise.all([updateMongo, updateSQL])
      res.status(201).json({ message: MESSAGES.USER_UPDATED_SUCCESS })
    } catch (err) {
      logger.error(`Error updating user:`, err.message)
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
      const { password } = req.body

      if (!password || password.trim() === "") {
        res.status(400).json({ error: "Password cannot be empty." })
        return
      }

      const usernameExists = await UserService.checkUsernameExists(
        req.params.username
      )
      if (!usernameExists) {
        res.status(404).json({ error: MESSAGES.USER_EMAIL_NOT_FOUND })
        return
      }

      await UserService.updatePassword(req.params.username, password)
      res.status(200).json({ message: MESSAGES.PASSWORD_UPDATED_SUCCESS })
    } catch (err) {
      logger.error(`Error updating password`, err.message)
      res.status(500).json({
        error: MESSAGES.ERROR_UPDATING_PASSWORD,
        details: err,
      })
    }
  }

  updateDriverRating = async (req, res) => {
    logger.info(`PUT: /api/auth/driverRating/${req.params.username}`)
    try {
      const model = "driverRating"
      await this.updateRating(req, res, model)
    } catch (err) {
      logger.error(
        "UserController - Error updating driverRating - ",
        err.message
      )
    }
  }

  updatePassengerRating = async (req, res) => {
    logger.info(`PUT: /api/auth/passengerRating/${req.params.username}`)
    try {
      const model = "passengerRating"
      await this.updateRating(req, res, model)
    } catch (err) {
      logger.error(
        "UserController - Error updating passengerRating - ",
        err.message
      )
    }
  }

  //TODO acrescentar totalRatings ao modelo e nesta função aqui fazer incremento +1 e média nova consoante valor introduzido OU fazer um get all + count das ofertas de boleia terminadas (ou candidaturas a boleia aceites em boleias terminadas) para obter o numero total e fazer o mesmo OU fazer a funçao que calcula a média à parte e trazer o valor para esta função aqui
  updateRating = async (req, res, ratingModel) => {
    logger.info(`userController - updateRating - ${ratingModel}`)
    try {
      const user = await UserService.findUserByUsernameMongo(
        req.params.username
      )
      if (!user) {
        res.status(404).json({ error: MESSAGES.USER_EMAIL_NOT_FOUND })
        return
      }

      const ratingValue = req.body[ratingModel]
      if (ratingValue === undefined) {
        res.status(400).json({ error: `Missing value for ${ratingModel}` })
        return
      }

      await UserService.updateRating(user, ratingModel, ratingValue)
      res.status(200).json({ message: `${ratingModel} updated successfully!` })
    } catch (err) {
      logger.error(`userController - updateRating`, err.message)
      if (err.message === "RatingMustBe1To5")
        res.status(400).json({ error: MESSAGES.RATING_MUST_1_TO_5 })
      else {
        res.status(500).json({
          error: `Failed updating ${ratingModel}`,
          details: err,
        })
      }
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
      logger.error(`Error deleting user`, err.message)
      res.status(500).json({
        error: MESSAGES.ERROR_DELETING_USER,
        details: err.message,
      })
    }
  }
}
export default new UserController()
