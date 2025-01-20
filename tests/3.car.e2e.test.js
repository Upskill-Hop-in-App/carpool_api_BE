import request from "supertest"

import { MESSAGES } from "../src/utils/responseMessages.js"
import { app } from "../src/app.js"
import { adminToken, clientToken, client2Token } from "./setup/testSetup.js"

let car1

describe("POST /api/cars", () => {
  test("should fail to create a car driver not found", async () => {
    const newCar = {
      brand: "toyota",
      model: "yaris",
      year: 1999,
      user: "INVALID_USER",
      color: "pink",
      plate: "22-22-AA",
    }
    const response = await request(app)
      .post("/api/cars")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newCar)

    expect(response.status).toBe(400)
    expect(response.body.error).toBe(MESSAGES.DRIVER_NOT_FOUND)
  })

  test("should create a car", async () => {
    const newCar = {
      brand: "toyota",
      model: "yaris",
      year: 1999,
      user: "client_name",
      color: "pink",
      plate: "22-22-AA",
    }
    const response = await request(app)
      .post("/api/cars")
      .set("Authorization", `Bearer ${clientToken}`)
      .send(newCar)

    expect(response.status).toBe(201)
    expect(response.body.message).toBe(MESSAGES.CAR_CREATED)
    car1 = response.body.data
  })
})

describe("PUT /api/cars", () => {
  test("should update car", async () => {
    const updatedCar = {
      brand: "toyota",
      model: "yaris",
      year: 1999,
      user: "client_name",
      color: "black",
      plate: "22-22-AA",
    }

    const response = await request(app)
      .put(`/api/cars/${car1.cc}`)
      .set("Authorization", `Bearer ${clientToken}`)
      .send(updatedCar)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe(MESSAGES.CAR_UPDATED)
    expect(response.body.data.color).toBe("black")
  })

  test("should fail to update car for missing required fields", async () => {
    const updatedCar = {
      model: "4c",
      year: 2020,
      user: "client_name",
      color: "black",
      plate: "00-AA-00",
    }

    const response = await request(app)
      .put(`/api/cars/${car1.cc}`)
      .set("Authorization", `Bearer ${clientToken}`)
      .send(updatedCar)
    expect(response.status).toBe(400)
    expect(response.body.error).toBe(MESSAGES.MISSING_REQUIRED_FIELDS)
  })
})

describe("DELETE /api/cars", () => {
  test("should fail to delete car for invalid code", async () => {
    const response = await request(app)
      .delete(`/api/cars/INVALIDCODE`)
      .set("Authorization", `Bearer ${adminToken}`)
    expect(response.status).toBe(400)
    expect(response.body.error).toBe(MESSAGES.CAR_NOT_FOUND_BY_CODE)
  })

  test("should fail to delete car using a different account", async () => {
    const newCar = {
      brand: "toyota",
      model: "yaris",
      year: 1999,
      user: "client_name",
      color: "green",
      plate: "11-11-AA",
    }
    const response1 = await request(app)
      .post("/api/cars")
      .set("Authorization", `Bearer ${clientToken}`)
      .send(newCar)
    expect(response1.status).toBe(201)
    expect(response1.body.message).toBe(MESSAGES.CAR_CREATED)
    car1 = response1.body.data

    const response2 = await request(app)
      .delete(`/api/cars/${car1.cc}`)
      .set("Authorization", `Bearer ${client2Token}`)
    expect(response2.status).toBe(403)
    expect(response2.body.error).toBe(MESSAGES.ACCESS_DENIED)
  })

  test("should delete car", async () => {
    const newCar = {
      brand: "toyota",
      model: "yaris",
      year: 1999,
      user: "client_name",
      color: "white",
      plate: "33-33-AA",
    }
    const response = await request(app)
      .post("/api/cars")
      .set("Authorization", `Bearer ${clientToken}`)
      .send(newCar)
    expect(response.status).toBe(201)
    expect(response.body.message).toBe(MESSAGES.CAR_CREATED)
    car1 = response.body.data

    const response1 = await request(app)
      .delete(`/api/cars/${car1.cc}`)
      .set("Authorization", `Bearer ${clientToken}`)
    expect(response1.status).toBe(200)
    expect(response1.body.message).toBe(MESSAGES.CAR_DELETED)
  })
})
