import request from "supertest"

import { MESSAGES } from "../src/utils/responseMessages.js"
import { app } from "../src/app.js"

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

test("should update user profile", async () => {
  const updatedClient = {
    email: "updatedclient@test.com",
    username: "updatedClientTest",
    name: "Client Test",
    contact: "1234567890",
  }

  const response = await request(app)
    .put("/api/auth/profile/clientTest")
    // .set("Authorization", `Bearer ${adminToken}`)
    .send(updatedClient)
  expect(response.status).toBe(200)
  expect(response.body.message).toBe(MESSAGES.USER_UPDATED_SUCCESS)
})

test("should update user password", async () => {
  const updatedPassword = {
    password: "123",
  }

  const response = await request(app)
    .put("/api/auth/password/updatedClientTest")
    // .set("Authorization", `Bearer ${adminToken}`)
    .send(updatedPassword)
  expect(response.status).toBe(200)
  expect(response.body.message).toBe(MESSAGES.PASSWORD_UPDATED_SUCCESS)
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
  expect(response.body.message).toBe(MESSAGES.RATING_SUCCESS)
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
  expect(response.body.message).toBe(MESSAGES.RATING_SUCCESS)
})

test("should anonymize user", async () => {
  const response = await request(app).put("/api/auth/delete/updatedClientTest")
  // .set("Authorization", `Bearer ${adminToken}`)
  expect(response.status).toBe(200)
  expect(response.body.message).toBe(MESSAGES.USER_ANONYMIZED_SUCCESS)
})
