import {} from "dotenv/config"
import mongoose from "mongoose"
import cors from "cors"
import express from "express"

import { userRoutes } from "./routes/userRoutes.js"
import logger from "./logger.js"
import { liftRoutes } from "./routes/liftRoutes.js"
import { carRoutes } from "./routes/carRoutes.js"
import { applicationRoutes } from "./routes/applicationRoutes.js"

const requiredEnvVars = [
  "SECRET_KEY",
  "NODE_ENV",
  "DB_CONNECTION_STRING",
  "DB_TEST_CONNECTION_STRING",
  "DB_SQLITE_TEST",
  "DB_SQLITE",
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
    process.env.DB_CONNECTION_STRING || "mongodb://mongo:27017/carpooldatabase",
}

const mongoConnectionString = dbConfig[process.env.NODE_ENV]
const port = process.env.PORT || 3000
const app = express()

app.use(express.json())

const allowedOrigins = process.env.ALLOWED_ORIGINS

const corsOptions = {
  origin: function (origin, callback) {
    /* - Allow requests with no origin (like from mobile apps or curl requests) - */
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow only specific HTTP methods if needed
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers if needed
}

/* ------------------ Apply CORS only if NODE_ENV is 'dev' ------------------ */
if (process.env.NODE_ENV === "dev") {
  app.use(cors(corsOptions))
}

mongoose.set("strictQuery", true)
mongoose
  .connect(mongoConnectionString || `mongodb://mongo:27017/carpooldatabase`)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((error) => logger.error("Could not connect to MongoDB:", error))

const server = app.listen(port, () => {
  logger.info(`CARPOOL-API App listening on port ${port}`)
})

app.use("/api/auth", userRoutes)

app.use("/api/lifts", liftRoutes)
app.use("/api/cars", carRoutes)
app.use("/api/applications", applicationRoutes)

export { app, server }
