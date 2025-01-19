import mongoose from "mongoose"
import request from "supertest"

import initializeTestDatabase from "../utils/testDatabaseSetup.js"
import { app, server } from "../../src/app.js"
import logger from "../../src/logger.js"

const port = process.env.PORT || 3000
const db = await initializeTestDatabase()
let adminToken = null
let clientToken = null
let client2Token = null

beforeAll(async () => {
  /* ------------------------- Connect to the database ------------------------ */
  await mongoose.connect(process.env.DB_TEST_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  /* ----------------------------- get admin token ---------------------------- */
  const adminUser = { email: "admin@test.com", password: "admin123" }

  try {
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send(adminUser)

    adminToken = loginResponse.body.userToken
    expect(loginResponse.status).toBe(200)
    logger.debug("Admin Test created successfully")
  } catch (error) {
    logger.error("Error logging in Admin Test: ", error.message)
  }

  /* ---------------------------- get client token ---------------------------- */
  const clientUser = { email: "client@test.com", password: "client123" }
  try {
    const loginClientResponse = await request(app)
      .post("/api/auth/login")
      .send(clientUser)

    clientToken = loginClientResponse.body.userToken
    expect(loginClientResponse.status).toBe(200)
    logger.debug("Client Test created successfully")
  } catch (error) {
    logger.error("Error logging in Client Test: ", error.message)
  }

  /* ---------------------------- get client token ---------------------------- */
  const client2User = { email: "client2@test.com", password: "client123" }
  try {
    const loginClientResponse = await request(app)
      .post("/api/auth/login")
      .send(client2User)

    client2Token = loginClientResponse.body.userToken
    expect(loginClientResponse.status).toBe(200)
    logger.debug("Client Test created successfully")
  } catch (error) {
    logger.error("Error logging in Client Test: ", error.message)
  }

  /* ------------------------------ Start server ------------------------------ */
  if (!server.listening) {
    server.listen(port, () => logger.debug(`Server is running on port ${port}`))
  }
})

afterAll(async () => {
  /* ------------------- Clean database and close the server ------------------ */
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  if (server.listening) {
    server.close()
  }
  db.close((err) => {
    if (err) {
      logger.error("Error closing the SQLite database: ", err.message)
    } else {
      logger.info("SQLite database connection closed.")
    }
  })
})

export { adminToken, clientToken, client2Token }
