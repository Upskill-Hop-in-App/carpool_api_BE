import request from "supertest"

import { MESSAGES } from "../src/utils/responseMessages.js"
import { app } from "../src/app.js"

describe("Car Tests", () => {
  let car
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
  })
  describe("POST /api/cars", () => {
    test("should fail to create a car driver not found", async () => {
      const newCar = {
        brand: "alfa romeo",
        model: "4c",
        year: 2020,
        user: "INVALID USER",
        color: "red",
        plate: "00-AA-00",
      }
      const response = await request(app).post("/api/cars").send(newCar)
      //   .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.DRIVER_NOT_FOUND)
    })

    test("should create a car", async () => {
      const newCar = {
        brand: "alfa romeo",
        model: "4c",
        year: 2020,
        user: "user",
        color: "red",
        plate: "00-AA-00",
      }
      const response = await request(app).post("/api/cars").send(newCar)
      //   .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.CAR_CREATED)
      car = response.body.data
    })

    test("should fail to create a car for invalid brand", async () => {
      const newCar = {
        brand: "INVALID BRAND",
        model: "4c",
        year: 2020,
        user: "user",
        color: "red",
        plate: "00-AA-00",
      }
      const response = await request(app).post("/api/cars").send(newCar)
      //   .set("Authorization", `Bearer ${adminToken}`)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.INVALID_CAR)
    })
  })
  describe("PUT /api/cars", () => {
    test("should update car", async () => {
      const updatedCar = {
        brand: "alfa romeo",
        model: "4c",
        year: 2020,
        user: "user",
        color: "black",
        plate: "00-AA-00",
      }

      const response = await request(app)
        .put(`/api/cars/${car.cc}`)
        .send(updatedCar)
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.CAR_UPDATED)
      expect(response.body.data.color).toBe("black")
    })

    test("should fail to update car for missing required fields", async () => {
      const updatedCar = {
        model: "4c",
        year: 2020,
        user: "user",
        color: "black",
        plate: "00-AA-00",
      }

      const response = await request(app)
        .put(`/api/cars/${car.cc}`)
        .send(updatedCar)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.MISSING_REQUIRED_FIELDS)
    })
  })

  describe("DELETE /api/cars", () => {
    test("should fail to delete car for invalid code", async () => {
      const response = await request(app).delete(`/api/cars/INVALIDCODE`)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.CAR_NOT_FOUND_BY_CODE)
    })

    test("should delete car", async () => {
      const newCar = {
        brand: "alfa romeo",
        model: "4c",
        year: 2020,
        user: "user",
        color: "black",
        plate: "11-AA-11",
      }
      const response = await request(app).post("/api/cars").send(newCar)
      //   .set("Authorization", `Bearer ${adminToken}`)
      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.CAR_CREATED)
      car = response.body.data

      const response1 = await request(app).delete(`/api/cars/${car.cc}`)
      expect(response1.status).toBe(200)
      expect(response1.body.message).toBe(MESSAGES.CAR_DELETED)
    })
  })
})
