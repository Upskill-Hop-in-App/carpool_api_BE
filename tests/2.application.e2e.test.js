import request from "supertest"

import { MESSAGES } from "../src/utils/responseMessages.js"
import { app } from "../src/app.js"
import { adminToken, clientToken } from "./setup/testSetup.js"

describe("Application Tests", () => {
  let car
  let lift1
  let lift2
  let application1
  let application2
  let application3
  let application4
  let application5
  let noApplicationUser
  let user0Token
  let user1Token
  let user2Token
  let user3Token
  let user4Token
  let user5Token
  let user6Token
  let user7Token

  beforeAll(async () => {
    /* -------------------------------------------------------------------------- */
    /* ---------------------- register users and get tokens --------------------- */
    /* -------------------------------------------------------------------------- */

    /* ----------------------------- user 0 - driver ---------------------------- */
    const newUser0 = {
      name: "User",
      email: "user@test.com",
      username: "user0",
      password: "123",
      contact: "123456789",
    }

    const user0Response = await request(app)
      .post("/api/auth/register/client")
      .send(newUser0)
    expect(user0Response.status).toBe(201)

    const login0Reponse = await request(app)
      .post("/api/auth/login")
      .send(newUser0)
    expect(login0Reponse.status).toBe(200)

    user0Token = login0Reponse.body.userToken

    /* --------------------------------- user 1 --------------------------------- */
    const newUser1 = {
      name: "User1",
      email: "user1@test.com",
      username: "user1",
      password: "123",
      contact: "123456789",
    }

    const user1Response = await request(app)
      .post("/api/auth/register/client")
      .send(newUser1)
    expect(user1Response.status).toBe(201)

    const login1Reponse = await request(app)
      .post("/api/auth/login")
      .send(newUser1)
    expect(login1Reponse.status).toBe(200)

    user1Token = login1Reponse.body.userToken

    /* --------------------------------- user 2 --------------------------------- */
    const newUser2 = {
      name: "User2",
      email: "user2@test.com",
      username: "user2",
      password: "123",
      contact: "123456789",
    }

    const user2Response = await request(app)
      .post("/api/auth/register/client")
      .send(newUser2)
    expect(user2Response.status).toBe(201)

    const login2Reponse = await request(app)
      .post("/api/auth/login")
      .send(newUser2)
    expect(login2Reponse.status).toBe(200)

    user2Token = login2Reponse.body.userToken

    /* --------------------------------- user 3 --------------------------------- */
    const newUser3 = {
      name: "User3",
      email: "user3@test.com",
      username: "user3",
      password: "123",
      contact: "123456789",
    }

    const user3Response = await request(app)
      .post("/api/auth/register/client")
      .send(newUser3)
    expect(user3Response.status).toBe(201)

    const login3Reponse = await request(app)
      .post("/api/auth/login")
      .send(newUser3)
    expect(login3Reponse.status).toBe(200)

    user3Token = login3Reponse.body.userToken

    /* --------------------------------- user 4 --------------------------------- */
    const newUser4 = {
      name: "User4",
      email: "user4@test.com",
      username: "user4",
      password: "123",
      contact: "123456789",
    }

    const user4Response = await request(app)
      .post("/api/auth/register/client")
      .send(newUser4)
    expect(user4Response.status).toBe(201)

    const login4Reponse = await request(app)
      .post("/api/auth/login")
      .send(newUser4)
    expect(login4Reponse.status).toBe(200)

    user4Token = login4Reponse.body.userToken

    /* --------------------------------- user 5 --------------------------------- */
    const newUser5 = {
      name: "User5",
      email: "user5@test.com",
      username: "user5",
      password: "123",
      contact: "123456789",
    }

    const user5Response = await request(app)
      .post("/api/auth/register/client")
      .send(newUser5)
    expect(user5Response.status).toBe(201)

    const login5Reponse = await request(app)
      .post("/api/auth/login")
      .send(newUser5)
    expect(login5Reponse.status).toBe(200)

    user5Token = login5Reponse.body.userToken

    /* --------------------------------- user 6 --------------------------------- */
    const newUser6 = {
      name: "User6",
      email: "user6@test.com",
      username: "user6",
      password: "123",
      contact: "123456789",
    }

    const user6Response = await request(app)
      .post("/api/auth/register/client")
      .send(newUser6)
    expect(user6Response.status).toBe(201)

    const login6Reponse = await request(app)
      .post("/api/auth/login")
      .send(newUser6)
    expect(login6Reponse.status).toBe(200)

    user6Token = login6Reponse.body.userToken

    /* --------------------------------- user 7 --------------------------------- */
    const newUser7 = {
      name: "User7",
      email: "user7@test.com",
      username: "user7",
      password: "123",
      contact: "123456789",
    }

    const user7Response = await request(app)
      .post("/api/auth/register/client")
      .send(newUser7)
    expect(user7Response.status).toBe(201)

    const login7Reponse = await request(app)
      .post("/api/auth/login")
      .send(newUser7)
    expect(login7Reponse.status).toBe(200)

    user7Token = login7Reponse.body.userToken

    noApplicationUser = newUser7

    const newCar = {
      brand: "toyota",
      model: "yaris",
      year: 1999,
      user: "user0",
      color: "pink",
      plate: "22-22-AA",
    }
    const carResponse = await request(app)
      .post("/api/cars")
      .set("Authorization", `Bearer ${user0Token}`)
      .send(newCar)
    expect(carResponse.status).toBe(201)
    car = carResponse.body.data.cc

    const newLift1 = {
      driver: "user0",
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
    const liftResponse1 = await request(app)
      .post("/api/lifts")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newLift1)

    expect(liftResponse1.status).toBe(201)
    lift1 = liftResponse1.body.data.cl

    const newLift2 = {
      driver: "user0",
      car: car,
      startPoint: { district: "braga", municipality: "braga", parish: "tadim" },
      endPoint: {
        district: "braga",
        municipality: "braga",
        parish: "priscos",
      },
      schedule: "2025/10/10 10:10",
      price: 200,
      providedSeats: 1,
    }
    const liftResponse2 = await request(app)
      .post("/api/lifts")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newLift2)

    expect(liftResponse2.status).toBe(201)
    lift2 = liftResponse2.body.data.cl
  })
  describe("POST /api/applications", () => {
    test("should return no applications from empty DB", async () => {
      const response = await request(app)
        .get("/api/applications")
        .set("Authorization", `Bearer ${user1Token}`)
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.NO_APPLICATIONS_FOUND)
    })

    test("should create new application", async () => {
      const newApplication = { passenger: "client_name", lift: lift1 }
      const response = await request(app)
        .post("/api/applications")
        .set("Authorization", `Bearer ${clientToken}`)
        .send(newApplication)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.APPLICATION_CREATED_SUCCESS)
      application1 = response.body.data
    })

    test("should fail to create duplicate application", async () => {
      const newApplication = { passenger: "client_name", lift: lift1 }
      const response = await request(app)
        .post("/api/applications")
        .set("Authorization", `Bearer ${clientToken}`)
        .send(newApplication)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.DUPLICATE_APPLICATION)
    })

    test("should fail to create an application for a different user", async () => {
      const newApplication = { passenger: "user1", lift: lift1 }
      const response = await request(app)
        .post("/api/applications")
        .set("Authorization", `Bearer ${user2Token}`)
        .send(newApplication)

      expect(response.status).toBe(403)
      expect(response.body.error).toBe(MESSAGES.ACCESS_DENIED)
    })

    test("should fail to create application for user not found", async () => {
      const newApplication = { passenger: "INVALIDUSER", lift: lift1 }
      const response = await request(app)
        .post("/api/applications")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newApplication)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.PASSENGER_NOT_FOUND)
    })

    test("should create additional applications", async () => {
      const newApplication1 = { passenger: "user1", lift: lift1 }
      const newApplication2 = { passenger: "user2", lift: lift1 }
      const newApplication3 = { passenger: "user3", lift: lift1 }
      const newApplication4 = { passenger: "user4", lift: lift2 }
      const newApplication5 = { passenger: "user5", lift: lift2 }
      const response1 = await request(app)
        .post("/api/applications")
        .set("Authorization", `Bearer ${user1Token}`)
        .send(newApplication1)

      const response2 = await request(app)
        .post("/api/applications")
        .set("Authorization", `Bearer ${user2Token}`)
        .send(newApplication2)

      const response3 = await request(app)
        .post("/api/applications")
        .set("Authorization", `Bearer ${user3Token}`)
        .send(newApplication3)

      const response4 = await request(app)
        .post("/api/applications")
        .set("Authorization", `Bearer ${user4Token}`)
        .send(newApplication4)

      const response5 = await request(app)
        .post("/api/applications")
        .set("Authorization", `Bearer ${user5Token}`)
        .send(newApplication5)

      expect(response1.status).toBe(201)
      expect(response1.body.message).toBe(MESSAGES.APPLICATION_CREATED_SUCCESS)
      expect(response2.status).toBe(201)
      expect(response2.body.message).toBe(MESSAGES.APPLICATION_CREATED_SUCCESS)
      expect(response3.status).toBe(201)
      expect(response3.body.message).toBe(MESSAGES.APPLICATION_CREATED_SUCCESS)
      expect(response4.status).toBe(201)
      expect(response4.body.message).toBe(MESSAGES.APPLICATION_CREATED_SUCCESS)
      expect(response5.status).toBe(201)
      expect(response5.body.message).toBe(MESSAGES.APPLICATION_CREATED_SUCCESS)
      application1 = response1.body.data
      application2 = response2.body.data
      application3 = response3.body.data
      application4 = response4.body.data
      application5 = response5.body.data
    })
  })
  describe("GET /api/applications", () => {
    test("should return all applications", async () => {
      const response = await request(app)
        .get("/api/applications")
        .set("Authorization", `Bearer ${adminToken}`)
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(
        MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS
      )
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data.length).toBeGreaterThan(0)
    })

    test("should return application by code", async () => {
      const response = await request(app)
        .get(`/api/applications/ca/${application1.ca}`)
        .set("Authorization", `Bearer ${user1Token}`)
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.APPLICATION_RETRIEVED_BY_CODE)
      expect(response.body.data.ca).toBe(application1.ca)
    })

    test("should fail to return application by code using invalid code", async () => {
      const response = await request(app)
        .get(`/api/applications/ca/INVALIDCODE`)
        .set("Authorization", `Bearer ${user1Token}`)
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.APPLICATION_NOT_FOUND)
    })

    test("should return application by passenger username", async () => {
      const response = await request(app)
        .get(`/api/applications/username/${application1.passenger.username}`)
        .set("Authorization", `Bearer ${user1Token}`)
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(
        MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS
      )
      const passengerUsernames = response.body.data.map(
        (app) => app.passenger.username
      )
      expect(passengerUsernames).toContain(application1.passenger.username)
    })

    test("should return no application by passenger username", async () => {
      const response = await request(app)
        .get(`/api/applications/username/${noApplicationUser.username}`)
        .set("Authorization", `Bearer ${user1Token}`)
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.NO_APPLICATIONS_FOUND)
    })

    test("should fail to return application by invalid passenger username", async () => {
      const response = await request(app)
        .get(`/api/applications/username/INVALIDUSERNAME`)
        .set("Authorization", `Bearer ${user1Token}`)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.USER_NOT_FOUND)
    })

    test("should return application by passenger email", async () => {
      const response = await request(app)
        .get(`/api/applications/email/${application1.passenger.email}`)
        .set("Authorization", `Bearer ${user1Token}`)
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(
        MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS
      )
      const passengerEmails = response.body.data.map(
        (app) => app.passenger.email
      )
      expect(passengerEmails).toContain(application1.passenger.email)
    })

    test("should fail to return application by invalid passenger email", async () => {
      const response = await request(app)
        .get(`/api/applications/email/INVALIDEMAIL`)
        .set("Authorization", `Bearer ${user1Token}`)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.USER_NOT_FOUND)
    })

    test("should return no application by passenger email", async () => {
      const response = await request(app)
        .get(`/api/applications/email/${noApplicationUser.email}`)
        .set("Authorization", `Bearer ${user1Token}`)
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.NO_APPLICATIONS_FOUND)
    })

    test("should return application by status", async () => {
      const response = await request(app)
        .get(`/api/applications/status/pending`)
        .set("Authorization", `Bearer ${user1Token}`)
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(
        MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS
      )
    })

    test("should fail to return application by invalid status", async () => {
      const response = await request(app)
        .get(`/api/applications/status/INVALIDSTATUS`)
        .set("Authorization", `Bearer ${user1Token}`)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.INVALID_STATUS)
    })

    test("should fail to return application by invalid status", async () => {
      const response = await request(app)
        .get(`/api/applications/status/accepted`)
        .set("Authorization", `Bearer ${user1Token}`)
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.NO_APPLICATIONS_FOUND)
    })

    test("should return application by status and username", async () => {
      const response = await request(app)
        .get(
          `/api/applications/username/status/${application1.passenger.username}/pending`
        )
        .set("Authorization", `Bearer ${user1Token}`)
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(
        MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS
      )
    })

    test("should return application by status and email", async () => {
      const response = await request(app)
        .get(
          `/api/applications/email/status/${application1.passenger.email}/pending`
        )
        .set("Authorization", `Bearer ${user1Token}`)
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(
        MESSAGES.APPLICATIONS_RETRIEVED_SUCCSESS
      )
    })
  })
  describe("PUT /api/applications", () => {
    test("should not update an application status to rejected using an account not related to the lift", async () => {
      const response = await request(app)
        .put(`/api/applications/reject/${application1.ca}`)
        .set("Authorization", `Bearer ${user7Token}`)
      expect(response.status).toBe(403)
      expect(response.body.error).toBe(MESSAGES.ACCESS_DENIED)
    })

    test("should not update an application status to canceled using an account not related to the lift", async () => {
      const response = await request(app)
        .put(`/api/applications/cancel/${application1.ca}`)
        .set("Authorization", `Bearer ${user7Token}`)
      expect(response.status).toBe(403)
      expect(response.body.error).toBe(MESSAGES.ACCESS_DENIED)
    })

    test("should not update an application status to accepted using an account not related to the lift", async () => {
      const response = await request(app)
        .put(`/api/applications/accept/${application1.ca}`)
        .set("Authorization", `Bearer ${user7Token}`)
      expect(response.status).toBe(403)
      expect(response.body.error).toBe(MESSAGES.ACCESS_DENIED)
    })

    test("should not update an application status to accepted using the passenger account", async () => {
      const response = await request(app)
        .put(`/api/applications/accept/${application1.ca}`)
        .set("Authorization", `Bearer ${user1Token}`)
      expect(response.status).toBe(403)
      expect(response.body.error).toBe(MESSAGES.ACCESS_DENIED)
    })

    test("should not update an application status to rejected using the passenger account", async () => {
      const response = await request(app)
        .put(`/api/applications/reject/${application1.ca}`)
        .set("Authorization", `Bearer ${user1Token}`)
      expect(response.status).toBe(403)
      expect(response.body.error).toBe(MESSAGES.ACCESS_DENIED)
    })

    test("should not update an application status to canceled using the driver account", async () => {
      const response = await request(app)
        .put(`/api/applications/cancel/${application1.ca}`)
        .set("Authorization", `Bearer ${user0Token}`)
      expect(response.status).toBe(403)
      expect(response.body.error).toBe(MESSAGES.ACCESS_DENIED)
    })

    test("driver should update application status to accepted", async () => {
      const response = await request(app)
        .put(`/api/applications/accept/${application1.ca}`)
        .set("Authorization", `Bearer ${user0Token}`)
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.APPLICATION_ACCEPTED_SUCCESS)
      expect(response.body.data.status).toBe("accepted")
    })

    test("driver should update application status to rejected", async () => {
      const response = await request(app)
        .put(`/api/applications/reject/${application2.ca}`)
        .set("Authorization", `Bearer ${user0Token}`)
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.APPLICATION_REJECTED_SUCCESS)
      expect(response.body.data.status).toBe("rejected")
    })

    test("passenger should update application status to canceled", async () => {
      const response = await request(app)
        .put(`/api/applications/cancel/${application3.ca}`)
        .set("Authorization", `Bearer ${user3Token}`)
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.APPLICATION_CANCELED_SUCCESS)
      expect(response.body.data.status).toBe("canceled")
    })

    test("should update application status to accepted, update lift status to ready and reject remaining pending applications", async () => {
      const response1 = await request(app)
        .put(`/api/applications/accept/${application4.ca}`)
        .set("Authorization", `Bearer ${user0Token}`)

      expect(response1.status).toBe(200)
      expect(response1.body.message).toBe(MESSAGES.APPLICATION_ACCEPTED_SUCCESS)
      expect(response1.body.data.status).toBe("accepted")
      expect(response1.body.data.lift.status).toBe("ready")

      const response2 = await request(app)
        .get(`/api/applications/ca/${application5.ca}`)
        .set("Authorization", `Bearer ${user0Token}`)

      expect(response2.status).toBe(200)
      expect(response2.body.message).toBe(
        MESSAGES.APPLICATION_RETRIEVED_BY_CODE
      )
      expect(response2.body.data.status).toBe("rejected")
    })

    test("should update application status to canceled and update lift status to open", async () => {
      const response = await request(app)
        .put(`/api/applications/cancel/${application4.ca}`)
        .set("Authorization", `Bearer ${user4Token}`)

      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.APPLICATION_CANCELED_SUCCESS)
      expect(response.body.data.status).toBe("canceled")
      expect(response.body.data.lift.status).toBe("open")
    })
  })
})
