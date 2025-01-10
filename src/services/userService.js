import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
import {} from "dotenv/config";

import User from "../models/userModel.js";
import logger from "../logger.js";

const dbConfig = {
  test: process.env.DB_SQLITE_TEST,
  dev: process.env.DB_SQLITE,
};

const db = new sqlite3.Database(dbConfig[process.env.NODE_ENV]);
const saltRounds = parseInt(process.env.SALT_ROUNDS);

class UserService {
  async checkEmailAlreadyExists(email) {
    logger.info("userService - checkEmailAlreadyExists");
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) {
          logger.error("userService - checkEmailAlreadyExists: ", err.message);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async checkUsernameAlreadyExists(username) {
    logger.info("userService - checkUsernameAlreadyExists");
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, row) => {
          if (err) {
            logger.error(
              "userService - checkUsernameAlreadyExists: ",
              err.message
            );
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  async saveUserMongo(data, role) {
    logger.info("userService - saveUserMongo");
    const { email, name, username, contact, driverRating, passengerRating } =
      data;
    try {
      const user = new User({
        email,
        name,
        username,
        contact,
        role: role,
        driverRating,
        passengerRating,
      });
      await user.save();
    } catch (err) {
      logger.error("userService - saveUserMongo: " + err.message);
      throw err;
    }
  }

  async saveUserSQL(email, username, password, role) {
    logger.info("userService - saveUserSQL");
    const hashedPassword = await this.hashPassword(password);
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO users (email,username, password, role) VALUES (?, ?, ?, ?)",
        [email, username, hashedPassword, role],
        function (err) {
          if (err) {
            logger.error("userService - saveUserSQL: ", err.message);
            reject(err);
          } else {
            resolve({ message: "User saved successfully" });
          }
        }
      );
    });
  }

  async hashPassword(password) {
    logger.info("userService - hashPassword");
    return await bcrypt.hash(password, saltRounds);
  }
}

export default new UserService();
