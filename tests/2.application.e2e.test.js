import request from "supertest"

import { MESSAGES } from "../src/utils/responseMessages.js"
import { app } from "../src/app.js"

describe("Application Tests", () => {
  let car
  let lift
  beforeAll(async () => {
    /* ---------------------- Create prerequisites for test --------------------- */
    const newUser = {
      name: "User",
      email: "user@test.com",
      username: "user",
      password: "123",
      contact: "123456789",
    }
    const userResponse = await request(app)
      .post("/api/auth/register/client")
      //   .set("Authorization", `Bearer ${adminToken}`)
      .send(newUser)
    expect(userResponse.status).toBe(201)

    const newUser1 = {
      name: "User1",
      email: "user1@test.com",
      username: "user1",
      password: "123",
      contact: "123456789",
    }
    const user1Response = await request(app)
      .post("/api/auth/register/client")
      //   .set("Authorization", `Bearer ${adminToken}`)
      .send(newUser1)
    expect(user1Response.status).toBe(201)

    const newUser2 = {
      name: "User2",
      email: "user2@test.com",
      username: "user2",
      password: "123",
      contact: "123456789",
    }
    const user2Response = await request(app)
      .post("/api/auth/register/client")
      //   .set("Authorization", `Bearer ${adminToken}`)
      .send(newUser2)
    expect(user2Response.status).toBe(201)

    const newUser3 = {
      name: "User3",
      email: "user3@test.com",
      username: "user3",
      password: "123",
      contact: "123456789",
    }
    const user3Response = await request(app)
      .post("/api/auth/register/client")
      //   .set("Authorization", `Bearer ${adminToken}`)
      .send(newUser3)
    expect(user3Response.status).toBe(201)

    const newCar = {
      brand: "toyota",
      model: "yaris",
      year: 2004,
      user: "user",
      color: "pink",
      plate: "22-22-AA",
    }
    const carResponse = await request(app)
      .post("/api/cars")
      //   .set("Authorization", `Bearer ${adminToken}`)
      .send(newCar)
    expect(carResponse.status).toBe(201)
    car = carResponse.body.data.cc

    const newLift = {
      driver: "user",
      car: car,
      startPoint: { district: "braga", municipality: "braga", parish: "tadim" },
      endPoint: {
        district: "braga",
        municipality: "braga",
        parish: "priscos",
      },
      schedule: "2025/10/10 10:10",
      price: 200,
      providedSeats: 2,
    }
    const liftResponse = await request(app).post("/api/lifts").send(newLift)
    expect(liftResponse.status).toBe(201)
    lift = liftResponse.body.data.cl
  })
  describe("POST /api/applications", () => {
    test("should return no applications from empty DB", async () => {
      const response = await request(app).get("/api/applications")
      console.log()
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.NO_APPLICATIONS_FOUND)
    })

    test("should create new application", async () => {
      const newApplication = { passenger: "user1", lift: lift }
      const response = await request(app)
        .post("/api/applications")
        .send(newApplication)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.APPLICATION_CREATED_SUCCESS)
    })

    test("should fail to create duplicate application", async () => {
      const newApplication = { passenger: "user1", lift: lift }
      const response = await request(app)
        .post("/api/applications")
        .send(newApplication)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.DUPLICATE_APPLICATION)
    })

    test("should fail to create application for user not found", async () => {
      const newApplication = { passenger: "user6", lift: lift }
      const response = await request(app)
        .post("/api/applications")
        .send(newApplication)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.PASSENGER_NOT_FOUND)
    })

    test("should fail to create application for user not found", async () => {
      const newApplication = { passenger: "user6", lift: lift }
      const response = await request(app)
        .post("/api/applications")
        .send(newApplication)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.PASSENGER_NOT_FOUND)
    })

    test("should create new application and update lift status to ready", async () => {
      const newApplication = { passenger: "user2", lift: lift }
      const response = await request(app)
        .post("/api/applications")
        .send(newApplication)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.APPLICATION_CREATED_SUCCESS)
    })
  })
})
