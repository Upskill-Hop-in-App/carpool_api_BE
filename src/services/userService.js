import {} from "dotenv/config"
import bcrypt from "bcrypt"
import sqlite3 from "sqlite3"
import fs from "fs"
import jwt from "jsonwebtoken"

import User from "../models/userModel.js"
import logger from "../logger.js"

const dbConfig = {
  test: process.env.DB_SQLITE_TEST,
  dev: process.env.DB_SQLITE,
}

const db = new sqlite3.Database(dbConfig[process.env.NODE_ENV])
const saltRounds = parseInt(process.env.SALT_ROUNDS)
const privateJwtKey = fs.readFileSync(process.env.PRIVATE_JWT_KEY_FILE, "utf8")

class UserService {
  async checkEmailExists(email) {
    logger.info("userService - checkEmailExists")
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) {
          logger.error("userService - checkEmailExists: ", err.message)
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }

  async checkUsernameExists(username) {
    logger.info("userService - checkUsernameExists")
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, row) => {
          if (err) {
            logger.error("userService - checkUsernameExists: ", err.message)
            reject(err)
          } else {
            resolve(row)
          }
        }
      )
    })
  }

  async findUserByUsernameMongo(username) {
    logger.info(`userService - findUserByUsernameMongo`)
    try {
      const user = await User.findOne({ username })
      return user
    } catch (err) {
      logger.error(`userService - findUserByUsernameMongo: ${err.message}`)
    }
  }

  async findUserByEmailMongo(email) {
    logger.info(`userService - findUserByEmailMongo`)
    try {
      const user = await User.findOne({ email })
      return user
    } catch (err) {
      logger.error(`userService - findUserByEmailMongo: ${err.message}`)
    }
  }

  async findUserByEmailSQL(email) {
    logger.info("userService - findUserByEmailSQL")
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) {
          logger.error("userService - findUserByEmailSQL: ", err.message)
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }

  async saveUserMongo(data) {
    logger.info("userService - saveUserMongo")
    const {
      email,
      name,
      username,
      contact,
      role,
      driverRating,
      passengerRating,
    } = data
    try {
      const user = new User({
        email,
        name,
        username,
        contact,
        role,
        driverRating,
        passengerRating,
      })
      await user.save()
    } catch (err) {
      logger.error("userService - saveUserMongo: " + err.message)
      throw err
    }
  }

  async saveUserSQL(email, username, password, role) {
    logger.info("userService - saveUserSQL")
    const hashedPassword = await this.hashPassword(password)
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO users (email,username, password, role) VALUES (?, ?, ?, ?)",
        [email, username, hashedPassword, role],
        function (err) {
          if (err) {
            logger.error("userService - saveUserSQL: ", err.message)
            reject(err)
          } else {
            resolve({ message: "User saved successfully" })
          }
        }
      )
    })
  }

  async hashPassword(password) {
    logger.info("userService - hashPassword")
    return await bcrypt.hash(password, saltRounds)
  }

  async generateToken(authData) {
    logger.info("userService - generateToken")
    const token = jwt.sign(authData, privateJwtKey, {
      algorithm: "RS256",
      expiresIn: "30d",
    })
    return token
  }

  async validateLogin(email, password) {
    logger.info("userService - validateLogin")
    const userMongo = await this.findUserByEmailMongo(email)
    const userSQL = await this.findUserByEmailSQL(email)
    logger.debug("userService - found userSQL: ", !!userSQL)
    if (!userSQL) {
      throw new Error("UserNotFound")
    } else {
      const hashedPassword = await userSQL.password
      const passwordMatch = await bcrypt.compare(password, hashedPassword)
      const authData = {
        email: userSQL.email,
        Role: userSQL.role,
        status: userSQL.status,
      }

      if (!passwordMatch) {
        logger.debug("userService - passwordMatch: false")
        throw new Error("IncorrectUserOrPassword")
      }

      if (!privateJwtKey) {
        logger.debug("JWT PRIVATE KEY rejected")
        reject(new Error("JWT PRIVATE KEY rejected."))
        return
      }

      const token = await this.generateToken(authData)

      logger.debug("Token generated successfully")

      return token
    }
  }

  async updateUserMongo(paramsUsername, updates) {
    logger.info(`userService - updateUserMongo`)
    const { email, username, name, contact } = updates

    const user = await User.findOne({ username: paramsUsername })
    user.email = email || user.email
    user.name = name || user.name
    user.username = username || user.username
    user.role = user.role
    user.contact = contact || user.contact
    user.passengerRating = user.passengerRating
    user.driverRating = user.driverRating

    await user.save()
    return await User.findOne({ username: user.username })
  }

  async updateUserSQL(paramsUsername, password, updates) {
    logger.info(`userService - updateUserSQL`)
    const { email, username } = updates

    let hashedPassword
    if (password) {
      hashedPassword = await this.hashPassword(password)
    }

    return new Promise((resolve, reject) => {
      const queryParts = []
      const params = []

      if (email) {
        queryParts.push("email = ?")
        params.push(email)
      }
      if (username) {
        queryParts.push("username = ?")
        params.push(username)
      }
      if (password) {
        queryParts.push("password = ?")
        params.push(hashedPassword)
      }
      const query = `UPDATE users SET ${queryParts.join(
        ", "
      )} WHERE username = ?`
      params.push(paramsUsername)

      db.run(query, params, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve({ message: "User updated successfully" })
        }
      })
    })
  }

  async updatePassword(paramsUsername, password) {
    logger.info(`userService - updatePassword`)
    try {
      const hashedPassword = await this.hashPassword(password)

      const query = "UPDATE users SET password = ? WHERE username = ?"
      const params = [hashedPassword, paramsUsername]

      return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
          if (err) {
            logger.error(`Error in updatePassword: ${err.message}`)
            reject(err)
          } else {
            resolve({ message: "Password updated successfully" })
          }
        })
      })
    } catch (err) {
      logger.error(`Error hashing password: ${err.message}`)
      throw err
    }
  }

  async updateRating(user, ratingModel, ratingValue) {
    logger.info("userService - updateRating")
    if (typeof ratingValue !== "number" || ratingValue < 1 || ratingValue > 5) {
      throw new Error("RatingMustBe1To5")
    }

    if (ratingModel === "driverRating") {
      user.driverRating = ratingValue
    } else {
      user.passengerRating = ratingValue
    }
    await user.save()
    return await User.findOne({ username: user.username })
  }

  async deleteUserMongo(username) {
    logger.info("userService - deleteUserMongo")
    try {
      await User.findOneAndDelete({ username })
    } catch (err) {
      logger.error(`userService - deleteUserMongo: ${err.message}`)
      throw err
    }
  }

  async deleteUserSQL(username) {
    logger.info("userService - deleteUserSQL")
    return new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM users WHERE username = ?",
        [username],
        function (err) {
          if (err) {
            logger.error("userService - deleteUserSQL: ", err.message)
            reject(err)
          } else {
            resolve({ message: "User deleted successfully from SQLite" })
          }
        }
      )
    })
  }
}

export default new UserService()
