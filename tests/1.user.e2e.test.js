import request from "supertest"

import { MESSAGES } from "../src/utils/responseMessages.js"
import { app } from "../src/app.js"
import UserService from "../src/services/userService.js"
import { adminToken, clientToken } from "./setup/testSetup.js"
import { response } from "express"

describe("User Endpoints", () => {
  test("should create a new admin", async () => {
    const newAdmin = {
      email: "newadmin@test.com",
      password: "admin123",
      username: "adminTest",
      name: "Admin Test",
      contact: "1234567890",
    }

    const response = await request(app)
      .post("/api/auth/register/admin")
      // .set("Authorization", `Bearer ${adminToken}`)
      .send(newAdmin)
    expect(response.status).toBe(201)
    expect(response.body.message).toBe(MESSAGES.REGISTER_SUCCESS)
  })

  test("should login as new admin", async () => {
    const adminUser = { email: "newadmin@test.com", password: "admin123" }

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send(adminUser)

    const adminTestToken = loginResponse.body.userToken
    const decodedAdminToken = await UserService.getDecodedToken(adminTestToken)
    expect(loginResponse.status).toBe(200)
    expect(decodedAdminToken.role).toBe("admin")
  })

  test("should create a new client", async () => {
    const newClient = {
      email: "newclient@test.com",
      password: "client123",
      username: "clientTest",
      name: "Client Test",
      contact: "1234567890",
    }

    const response = await request(app)
      .post("/api/auth/register/client")
      // .set("Authorization", `Bearer ${adminToken}`)
      .send(newClient)
    expect(response.status).toBe(201)
    expect(response.body.message).toBe(MESSAGES.REGISTER_SUCCESS)
  })

  test("should login as client", async () => {
    const clientUser = { email: "newclient@test.com", password: "client123" }

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send(clientUser)

    const clientTestToken = loginResponse.body.userToken
    const decodedClientToken = await UserService.getDecodedToken(
      clientTestToken
    )
    expect(loginResponse.status).toBe(200)
    expect(decodedClientToken.role).toBe("client")
  })

  test("should update user profile", async () => {
    const newClient2 = {
      email: "newclient2@test.com",
      password: "client123",
      username: "clientTest2",
      name: "Client Test 2",
      contact: "1234567890",
    }

    const updatedClient = {
      email: "updatedclient@test.com",
      username: "updatedClientTest",
      name: "Client Test",
      contact: "1234567890",
    }

    const response1 = await request(app)
      .post("/api/auth/register/client")
      // .set("Authorization", `Bearer ${adminToken}`)
      .send(newClient2)
    expect(response1.status).toBe(201)
    expect(response1.body.message).toBe(MESSAGES.REGISTER_SUCCESS)

    const response2 = await request(app)
      .put("/api/auth/profile/clientTest2")
      // .set("Authorization", `Bearer ${adminToken}`)
      .send(updatedClient)
    expect(response2.status).toBe(201)
    expect(response2.body.message).toBe(MESSAGES.USER_UPDATED_SUCCESS)
  })

  test("should update user password", async () => {
    const updatedPassword = {
      password: "123",
    }

    const response = await request(app)
      .put("/api/auth/password/client_name")
      // .set("Authorization", `Bearer ${adminToken}`)
      .send(updatedPassword)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe(MESSAGES.PASSWORD_UPDATED_SUCCESS)
  })

  test("should fail to update user password to empty password", async () => {
    const updatedPassword = {
      password: "",
    }

    const response = await request(app)
      .put("/api/auth/password/client_name")
      // .set("Authorization", `Bearer ${adminToken}`)
      .send(updatedPassword)
    expect(response.status).toBe(400)
    expect(response.body.error).toBe(MESSAGES.PASSWORD_EMPTY)
  })

  test("should update driver rating", async () => {
    const updatedDriverRating = {
      driverRating: 2,
    }

    const response = await request(app)
      .put("/api/auth/driverRating/updatedClientTest")
      // .set("Authorization", `Bearer ${adminToken}`)
      .send(updatedDriverRating)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe(MESSAGES.RATING_UPDATED_SUCCESS)
  })

  test("should update passenger rating", async () => {
    const updatedPassengerRating = {
      passengerRating: 2,
    }

    const response = await request(app)
      .put("/api/auth/passengerRating/updatedClientTest")
      // .set("Authorization", `Bearer ${adminToken}`)
      .send(updatedPassengerRating)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe(MESSAGES.RATING_UPDATED_SUCCESS)
  })

  test("should anonymize user", async () => {
    const response = await request(app).put("/api/auth/delete/client_name")
    // .set("Authorization", `Bearer ${adminToken}`)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe(MESSAGES.USER_ANONYMIZED_SUCCESS)
  })
})
