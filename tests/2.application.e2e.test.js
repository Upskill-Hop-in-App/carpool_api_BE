import request from "supertest"

import { MESSAGES } from "../src/utils/responseMessages.js"
import { app } from "../src/app.js"

describe("Application Tests", () => {
  let car
  let lift
  let application
  let application1
  let application2
  let application3
  let application4
  let noApplicationUser
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

    const newUser4 = {
      name: "User4",
      email: "user4@test.com",
      username: "user4",
      password: "123",
      contact: "123456789",
    }
    const user4Response = await request(app)
      .post("/api/auth/register/client")
      //   .set("Authorization", `Bearer ${adminToken}`)
      .send(newUser4)
    expect(user4Response.status).toBe(201)

    noApplicationUser = newUser4

    const newUser5 = {
      name: "User5",
      email: "user5@test.com",
      username: "user5",
      password: "123",
      contact: "123456789",
    }
    const user5Response = await request(app)
      .post("/api/auth/register/client")
      //   .set("Authorization", `Bearer ${adminToken}`)
      .send(newUser5)
    expect(user5Response.status).toBe(201)

    const newUser6 = {
      name: "User6",
      email: "user6@test.com",
      username: "user6",
      password: "123",
      contact: "123456789",
    }
    const user6Response = await request(app)
      .post("/api/auth/register/client")
      //   .set("Authorization", `Bearer ${adminToken}`)
      .send(newUser6)
    expect(user6Response.status).toBe(201)

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
      application = response.body.data
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
      const newApplication = { passenger: "INVALIDUSER", lift: lift }
      const response = await request(app)
        .post("/api/applications")
        .send(newApplication)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.PASSENGER_NOT_FOUND)
    })

    test("should create additional applications", async () => {
      const newApplication = { passenger: "user2", lift: lift }
      const newApplication1 = { passenger: "user3", lift: lift }
      const newApplication2 = { passenger: "user5", lift: lift }
      const newApplication3 = { passenger: "user6", lift: lift }
      const response = await request(app)
        .post("/api/applications")
        .send(newApplication)

      const response1 = await request(app)
        .post("/api/applications")
        .send(newApplication1)

      const response2 = await request(app)
        .post("/api/applications")
        .send(newApplication2)

      const response3 = await request(app)
        .post("/api/applications")
        .send(newApplication3)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.APPLICATION_CREATED_SUCCESS)
      expect(response1.status).toBe(201)
      expect(response1.body.message).toBe(MESSAGES.APPLICATION_CREATED_SUCCESS)
      expect(response2.status).toBe(201)
      expect(response2.body.message).toBe(MESSAGES.APPLICATION_CREATED_SUCCESS)
      expect(response3.status).toBe(201)
      expect(response3.body.message).toBe(MESSAGES.APPLICATION_CREATED_SUCCESS)
      application1 = response.body.data
      application2 = response1.body.data
      application3 = response2.body.data
      application4 = response3.body.data
    })
  })
  describe("GET /api/applications", () => {
    test("should return all applications", async () => {
      const response = await request(app).get("/api/applications")
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(
        MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS
      )
    })

    test("should return application by code", async () => {
      const response = await request(app).get(
        `/api/applications/ca/${application.ca}`
      )
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.APPLICATION_RETRIEVED_BY_CODE)
      expect(response.body.data.ca).toBe(application.ca)
    })

    test("should fail to return application by code", async () => {
      const response = await request(app).get(
        `/api/applications/ca/INVALIDCODE`
      )
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.APPLICATION_NOT_FOUND)
    })

    test("should return application by passenger username", async () => {
      const response = await request(app).get(
        `/api/applications/username/${application.passenger.username}`
      )
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(
        MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS
      )
      const passengerUsernames = response.body.data.map(
        (app) => app.passenger.username
      )
      expect(passengerUsernames).toContain(application.passenger.username)
    })

    test("should return no application by passenger username", async () => {
      const response = await request(app).get(
        `/api/applications/username/${noApplicationUser.username}`
      )
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.NO_APPLICATIONS_FOUND)
    })

    test("should fail to return application by invalid passenger username", async () => {
      const response = await request(app).get(
        `/api/applications/username/INVALIDUSERNAME`
      )
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.USER_NOT_FOUND)
    })

    test("should return application by passenger email", async () => {
      const response = await request(app).get(
        `/api/applications/email/${application.passenger.email}`
      )
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(
        MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS
      )
      const passengerEmails = response.body.data.map(
        (app) => app.passenger.email
      )
      expect(passengerEmails).toContain(application.passenger.email)
    })

    test("should fail to return application by invalid passenger email", async () => {
      const response = await request(app).get(
        `/api/applications/email/INVALIDEMAIL`
      )
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.USER_NOT_FOUND)
    })

    test("should return no application by passenger email", async () => {
      const response = await request(app).get(
        `/api/applications/email/${noApplicationUser.email}`
      )
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.NO_APPLICATIONS_FOUND)
    })

    test("should return application by status", async () => {
      const response = await request(app).get(
        `/api/applications/status/pending`
      )
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(
        MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS
      )
    })

    test("should fail to return application by invalid status", async () => {
      const response = await request(app).get(
        `/api/applications/status/INVALIDSTATUS`
      )
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.INVALID_STATUS)
    })

    test("should fail to return application by invalid status", async () => {
      const response = await request(app).get(
        `/api/applications/status/accepted`
      )
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.NO_APPLICATIONS_FOUND)
    })

    test("should return application by status and username", async () => {
      const response = await request(app).get(
        `/api/applications/username/status/${application.passenger.username}/pending`
      )
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(
        MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS
      )
    })

    test("should return application by status and email", async () => {
      const response = await request(app).get(
        `/api/applications/email/status/${application.passenger.email}/pending`
      )
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(
        MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS
      )
    })
  })
  describe("PUT /api/applications", () => {
    test("should update application status to rejected", async () => {
      const response = await request(app).put(
        `/api/applications/reject/${application.ca}`
      )
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.APPLICATION_REJECTED_SUCCESS)
      expect(response.body.data.status).toBe("rejected")
    })

    test("should update application status to canceled", async () => {
      const response = await request(app).put(
        `/api/applications/cancel/${application1.ca}`
      )
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.APPLICATION_CANCELED_SUCCESS)
      expect(response.body.data.status).toBe("canceled")
    })

    test("should update application status to accepted", async () => {
      const response = await request(app).put(
        `/api/applications/accept/${application2.ca}`
      )
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.APPLICATION_ACCEPTED_SUCCESS)
      expect(response.body.data.status).toBe("accepted")
    })

    test("should update application status to accepted and lift status to ready", async () => {
      const response = await request(app).put(
        `/api/applications/accept/${application3.ca}`
      )

      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.APPLICATION_ACCEPTED_SUCCESS)
      expect(response.body.data.status).toBe("accepted")
      expect(response.body.data.lift.status).toBe("ready")
    })

    test("remaining pending applications' status should be rejected", async () => {
      const response = await request(app).get(
        `/api/applications/ca/${application4.ca}`
      )

      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.APPLICATION_RETRIEVED_BY_CODE)
      expect(response.body.data.status).toBe("rejected")
    })

    test("should update application status to canceled and update lift status to open", async () => {
      const response = await request(app).put(
        `/api/applications/cancel/${application2.ca}`
      )

      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.APPLICATION_CANCELED_SUCCESS)
      expect(response.body.data.status).toBe("canceled")
      expect(response.body.data.lift.status).toBe("open")
    })
  })
})
