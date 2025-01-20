import sqlite3 from "sqlite3"
import bcrypt from "bcrypt"
import fs from "fs"
import path from "path"

import UserInputDTO from "../../src/DTO/userInputDTO"
import logger from "../../src/logger.js"
import UserService from "../../src/services/userService"

const initializeTestDatabase = async () => {
  const dbPath = path.resolve(process.env.DB_SQLITE_TEST)
  const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10

  const hashedPasswordAdmin = await bcrypt.hash("admin123", saltRounds)
  const hashedPasswordClient = await bcrypt.hash("client123", saltRounds)

  const users = [
    {
      email: "admin@test.com",
      username: "admin_user",
      password: hashedPasswordAdmin,
      name: "Admin Name",
      role: "admin",
      contact: "1234567890",
    },
    {
      email: "client@test.com",
      username: "client_name",
      password: hashedPasswordClient,
      name: "Client Name",
      role: "client",
      contact: "1234567890",
    },
    {
      email: "client2@test.com",
      username: "client2_name",
      password: hashedPasswordClient,
      name: "Client Name 2",
      role: "client",
      contact: "1234567890",
    },
  ]

  /* ------------------------- Create sqlite database ------------------------- */
  const db = new sqlite3.Database(
    dbPath,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
  )

  /* ---------------- Check if 'users' table exists and drop it ---------------- */
  await new Promise((resolve, reject) => {
    db.get(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='users';`,
      (err, row) => {
        if (err) {
          logger.error("Error checking for 'users' table: ", err.message)
          reject(`Error checking for 'users' table: ${err.message}`)
        } else if (row) {
          db.run(`DROP TABLE IF EXISTS users;`, (err) => {
            if (err) {
              logger.error("Error dropping 'users' table: ", err.message)
              reject(`Error dropping 'users' table: ${err.message}`)
            } else {
              logger.info("'users' table dropped.")
              resolve()
            }
          })
        } else {
          resolve()
        }
      }
    )
  })

  /* -------------------------- Force file creation -------------------------- */
  await new Promise((resolve, reject) => {
    db.run("PRAGMA user_version = 1;", (err) => {
      if (err) {
        logger.error("Error initializing database file: ", err.message)
        reject(`Error initializing database file: ${err.message}`)
      } else {
        resolve()
      }
    })
  })

  /* ------------------ Set permissions to full access ------------------ */
  if (fs.existsSync(dbPath)) {
    try {
      fs.chmodSync(dbPath, 0o666)
      logger.info(`Permissions for ${dbPath} set to 666.`)
    } catch (err) {
      logger.error("Error setting permissions to full access: ", err.message)
    }
  } else {
    logger.error(`Database file not found at ${dbPath}`)
  }

  /* ------------------------- Create 'users' table ------------------------ */
  await new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE users
        (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          role TEXT NOT NULL
        );
      `,
      (err) => {
        if (err) {
          reject(`Error creating table: ${err.message}`)
        } else {
          resolve()
        }
      }
    )
  })

  /* ---------------------- Insert users into sqlite3 ---------------------- */
  const insertAccount = (db, email, username, password, role) => {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (email, username, password, role) 
         VALUES (?, ?, ?, ?)`,
        [email, username, password, role],
        (err) => {
          if (err) {
            logger.error("Error inserting test users: ", err.message)
            reject(`Error inserting account (${email}): ${err.message}`)
          } else {
            resolve()
          }
        }
      )
    })
  }

  for (const user of users) {
    await insertAccount(db, user.email, user.username, user.password, user.role)
  }

  /* ---------------------- Insert users into the mongodb --------------------- */
  try {
    for (const user of users) {
      const inputDTO = new UserInputDTO(user)
      const userInput = await inputDTO.toUser(user.role)
      await UserService.saveUserMongo(userInput)
    }

    logger.info("Test users inserted into the mongodb successfully")
  } catch (err) {
    logger.error("Error initializing test mongodb:", err)
  }

  return db
}

export default initializeTestDatabase
