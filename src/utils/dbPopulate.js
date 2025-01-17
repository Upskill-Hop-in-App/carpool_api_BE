import {} from "dotenv/config"
import mongoose from "mongoose"
import Car from "../models/carModel.js"
import logger from "../logger.js"
import User from "../models/userModel.js"
import Lift from "../models/liftModel.js"
import Application from "../models/applicationModel.js"
import { v4 as uuidv4 } from "uuid"
import applicationService from "../services/applicationService.js"

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

async function populateData() {
  try {
    await mongoose.connection.dropDatabase()

    const users = [
      {
        name: "Admin",
        username: "admin",
        role: "admin",
        email: "admin@test.com",
        contact: "911111111",
      },
      {
        name: "Client",
        username: "client",
        role: "client",
        email: "client@test.com",
        contact: "911111111",
      },
    ]

    const createdUsers = await User.insertMany(users, { ordered: false })
    logger.info(`Successfully imported ${createdUsers.length} users.`)

    const user1 = await User.findOne({ username: "admin" })
    const user2 = await User.findOne({ username: "client" })

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

async function connectAndPopulate() {
  try {
    await connectToDatabase()
    await populateData()
  } catch (error) {
    logger.error("Error in main execution:", error)
  } finally {
    await mongoose.connection.close()
    logger.info("Database connection closed")
  }
}

await connectAndPopulate()
