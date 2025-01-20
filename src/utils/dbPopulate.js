import sqlite3 from "sqlite3"
import bcrypt from "bcrypt"
import fs from "fs"
import path from "path"
import mongoose from "mongoose"
import {} from "dotenv/config"
import { v4 as uuidv4 } from "uuid"

import Car from "../models/carModel.js"
import logger from "../logger.js"
import User from "../models/userModel.js"
import Lift from "../models/liftModel.js"
import Application from "../models/applicationModel.js"

const requiredEnvVars = [
  "NODE_ENV",
  "DB_CONNECTION_STRING",
  "DB_TEST_CONNECTION_STRING",
]

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key])

if (missingEnvVars.length) {
  throw new Error(
    `Missing environment variables: ${missingEnvVars.join(
      ", "
    )}. Use 'env.sample' as example.`
  )
}

const dbPath = path.resolve(process.env.DB_SQLITE)
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10

const hashedPasswordAdmin = await bcrypt.hash("admin123", saltRounds)
const hashedPasswordClient = await bcrypt.hash("client123", saltRounds)
const users = [
  {
    email: "admin1@test.com",
    username: "admin1_user",
    password: hashedPasswordAdmin,
    name: "Admin Name",
    role: "admin",
    contact: "1234567890",
  },
  {
    email: "client1@test.com",
    username: "client1_name",
    password: hashedPasswordClient,
    name: "Client Name",
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

const dbConfig = {
  test: process.env.DB_TEST_CONNECTION_STRING,
  dev:
    process.env.DB_CONNECTION_STRING || "mongodb://mongo:27017/carsapidatabase",
}

const mongoConnectionString = dbConfig[process.env.NODE_ENV]

mongoose.set("strictQuery", true)

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoConnectionString, {
      serverSelectionTimeoutMS: 5000,
    })
    logger.info("Connected to MongoDB")
  } catch (error) {
    logger.error("Could not connect to MongoDB:", error)
    throw error
  }
}

async function test() {
  try {
    await mongoose.connection.dropDatabase()

    const createdUsers = await User.insertMany(users, { ordered: false })
    logger.info(`Successfully imported ${createdUsers.length} users.`)

    const user1 = await User.findOne({ username: "admin1_user" })
    const user2 = await User.findOne({ username: "client1_name" })

    if (!user1 || !user2) {
      throw new Error(
        "One or both users could not be found. Check user insertion."
      )
    }

    const cars = [
      {
        cc: uuidv4(),
        brand: "toyota",
        model: "yaris",
        year: 2004,
        user: user1._id,
        color: "black",
        plate: "22-23-BB",
      },
      {
        cc: uuidv4(),
        brand: "alfa romeo",
        model: "4c",
        year: 2020,
        user: user2._id,
        color: "pink",
        plate: "00-AA-00",
      },
    ]

    const createdCars = await Car.insertMany(cars, { ordered: false })
    logger.info(`Successfully imported ${createdCars.length} cars.`)

    const car1 = await Car.findOne({ user: user1._id })
    const car2 = await Car.findOne({ user: user2._id })
    if (!car1 || !car2) {
      throw new Error(
        "One or both cars could not be found. Check car insertion."
      )
    }

    const lifts = [
      {
        cl: uuidv4(),
        driver: user1._id,
        car: car1._id,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      },
      {
        cl: uuidv4(),
        driver: user2._id,
        car: car2._id,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      },
    ]

    const createdLifts = await Lift.insertMany(lifts, { ordered: false })
    logger.info(`Successfully imported ${createdLifts.length} lifts.`)

    const lift1 = await Lift.findOne({ driver: user1._id })
    const lift2 = await Lift.findOne({ driver: user2._id })

    const applications = [
      {
        ca: uuidv4(),
        passenger: user1._id,
        lift: lift2._id,
      },
      {
        ca: uuidv4(),
        passenger: user2._id,
        lift: lift1._id,
      },
    ]

    const createdApplications = await Application.insertMany(applications, {
      ordered: false,
    })
    logger.info(
      `Successfully imported ${createdApplications.length} applications.`
    )

    const application1 = await Application.findOne({ passenger: user1._id })
    const application2 = await Application.findOne({ passenger: user2._id })

    await Lift.updateOne(
      { _id: lift2._id },
      { $push: { applications: application1._id } }
    )

    await Lift.updateOne(
      { _id: lift1._id },
      { $push: { applications: application2._id } }
    )

    logger.info("Successfully updated lifts with application references.")
  } catch (err) {
    logger.error(`Error importing data: ${err.message}`)
    throw err
  }
}

async function connectAndtest() {
  try {
    await connectToDatabase()
    await test()
  } catch (error) {
    logger.error("Error in main execution:", error)
  } finally {
    await mongoose.connection.close()
    logger.info("Database connection closed")
    db.close((err) => {
      if (err) {
        logger.error("Error closing the SQLite database: ", err.message)
      } else {
        logger.info("SQLite database connection closed.")
      }
    })
  }
}

await connectAndtest()
