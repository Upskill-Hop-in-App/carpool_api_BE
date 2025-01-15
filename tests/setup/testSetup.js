import mongoose from "mongoose"
import request from "supertest"

import initializeTestDatabase from "../utils/testDatabaseSetup.js"
import { app, server } from "../../src/app.js"
import logger from "../../src/logger.js"

const port = process.env.PORT || 3000
const db = await initializeTestDatabase()
let adminToken = null
let clientToken = null

beforeAll(async () => {
  /* ------------------------- Connect to the database ------------------------ */
  await mongoose.connect(process.env.DB_TEST_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  // /* ----------------------------- get admin token ---------------------------- */
  // const adminUser = { email: "admin@test.com", password: "admin123" }
  // const loginResponse = await request(app)
  //   .post("/api/auth/login")
  //   .send(adminUser)

  // expect(loginResponse.status).toBe(200)
  // adminToken = loginResponse.body.userToken

  // /* -------------------------- get client 1 token -------------------------- */
  // const client1User = { email: "client1@test.com", password: "client123" }
  // const loginClient1Response = await request(app)
  //   .post("/api/auth/login")
  //   .send(client1User)

  // expect(loginClient1Response.status).toBe(200)
  // clientToken = loginClient1Response.body.userToken

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

export { adminToken, clientToken }
