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
  async checkEmailExists(email) {
    logger.info("userService - checkEmailExists");
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) {
          logger.error("userService - checkEmailExists: ", err.message);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async checkUsernameExists(username) {
    logger.info("userService - checkUsernameExists");
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, row) => {
          if (err) {
            logger.error("userService - checkUsernameExists: ", err.message);
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  async findUserMongo(username) {
    logger.info(`userService - findUserMongo`);
    return await User.findOne({ username: username });
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

  async updateUserMongo(paramsUsername, updates) {
    logger.info(`userService - updateUserMongo`);
    const { email, username, name, contact } = updates;

    const user = await User.findOne({ username: paramsUsername });
    user.email = email || user.email;
    user.name = name || user.name;
    user.username = username || user.username;
    user.role = user.role;
    user.contact = contact || user.contact;
    user.passengerRating = user.passengerRating;
    user.driverRating = user.driverRating;

    await user.save();
    return await User.findOne({ username: user.username });
  }

  async updateUserSQL(paramsUsername, password, updates) {
    logger.info(`userService - updateUserSQL`);
    const { email, username } = updates;

    let hashedPassword;
    if (password) {
      hashedPassword = await this.hashPassword(password);
    }

    return new Promise((resolve, reject) => {
      const queryParts = [];
      const params = [];

      if (email) {
        queryParts.push("email = ?");
        params.push(email);
      }
      if (username) {
        queryParts.push("username = ?");
        params.push(username);
      }
      if (password) {
        queryParts.push("password = ?");
        params.push(hashedPassword);
      }
      const query = `UPDATE users SET ${queryParts.join(
        ", "
      )} WHERE username = ?`;
      params.push(paramsUsername);

      db.run(query, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ message: "User updated successfully" });
        }
      });
    });
  }

  async updatePassword(paramsUsername, password) {
    logger.info(`userService - updatePassword`);
    try {
      const hashedPassword = await this.hashPassword(password);

      const query = "UPDATE users SET password = ? WHERE username = ?";
      const params = [hashedPassword, paramsUsername];

      return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
          if (err) {
            logger.error(`Error in updatePassword: ${err.message}`);
            reject(err);
          } else {
            resolve({ message: "Password updated successfully" });
          }
        });
      });
    } catch (err) {
      logger.error(`Error hashing password: ${err.message}`);
      throw err;
    }
  }

  async updateRating(user, ratingModel, ratingValue) {
    if (typeof ratingValue !== "number" || ratingValue < 1 || ratingValue > 5) {
      throw new Error("RatingMustBe1To5");
    }

    if (ratingModel === "driverRating") {
      user.driverRating = ratingValue;
    } else {
      user.passengerRating = ratingValue;
    }
    await user.save();
    return await User.findOne({ username: user.username });
  }

  async deleteUserMongo(username) {
    logger.info("userService - deleteUserMongo");
    try {
      await User.findOneAndDelete({ username });
    } catch (err) {
      logger.error(`userService - deleteUserMongo: ${err.message}`);
      throw err;
    }
  }

  async deleteUserSQL(username) {
    logger.info("userService - deleteUserSQL");
    return new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM users WHERE username = ?",
        [username],
        function (err) {
          if (err) {
            logger.error("userService - deleteUserSQL: ", err.message);
            reject(err);
          } else {
            resolve({ message: "User deleted successfully from SQLite" });
          }
        }
      );
    });
  }
}

export default new UserService();
