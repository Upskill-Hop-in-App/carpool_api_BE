import request from "supertest"

import { MESSAGES } from "../src/utils/responseMessages.js"
import { app } from "../src/app.js"

describe("Lift Tests", () => {
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
    const userResponse1 = await request(app)
      .post("/api/auth/register/client")
      //   .set("Authorization", `Bearer ${adminToken}`)
      .send(newUser1)
    expect(userResponse1.status).toBe(201)

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
  })
  describe("POST /api/lifts", () => {
    test("should return no lifts from empty DB", async () => {
      const response = await request(app).get("/api/lifts")
      expect(response.status).toBe(404)
      expect(response.body.error).toBe(MESSAGES.NO_LIFTS_FOUND)
    })

    test("should fail to create new lift for missing required fields", async () => {
      const newLift = {
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }
      const response = await request(app).post("/api/lifts").send(newLift)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.MISSING_REQUIRED_FIELDS)
    })

    test("should fail to create new lift for driver not found", async () => {
      const newLift = {
        driver: "INVALID DRIVER",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }
      const response = await request(app).post("/api/lifts").send(newLift)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.DRIVER_NOT_FOUND_BY_CODE)
    })

    test("should fail to create new lift for car not found", async () => {
      const newLift = {
        driver: "user",
        car: "INVALID CAR",
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }
      const response = await request(app).post("/api/lifts").send(newLift)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.CAR_NOT_FOUND_BY_CODE)
    })

    test("should fail to create new lift for same start and end points", async () => {
      const newLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }
      const response = await request(app).post("/api/lifts").send(newLift)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.MATCHING_START_END)
    })

    test("should fail to create new lift for invalid location", async () => {
      const newLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "INVALID LOCATION",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }
      const response = await request(app).post("/api/lifts").send(newLift)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.INVALID_LOCATION)
    })

    test("should fail to create new lift for invalid date format", async () => {
      const newLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "INVALID DATE FORMAT",
        price: 222,
        providedSeats: 2,
      }
      const response = await request(app).post("/api/lifts").send(newLift)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.INVALID_DATE_FORMAT)
    })

    test("should fail to create new lift for invalid date format", async () => {
      const newLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2022/10/10 10:10:10",
        price: 222,
        providedSeats: 2,
      }
      const response = await request(app).post("/api/lifts").send(newLift)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.DATE_IN_PAST)
    })

    test("should create new lift", async () => {
      const newLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }
      const response = await request(app).post("/api/lifts").send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data
    })
  })
  describe("GET /api/lifts", () => {
    test("should return all lifts", async () => {
      const response = await request(app).get("/api/lifts")
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.LIFTS_RETRIEVED)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data.length).toBeGreaterThan(0)
    })

    test("should return lift by code", async () => {
      const newLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }
      const response = await request(app).post("/api/lifts").send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data

      const response1 = await request(app).get(`/api/lifts/cl/${lift.cl}`)
      expect(response1.status).toBe(200)
      expect(response1.body.message).toBe(MESSAGES.LIFT_RETRIEVED_BY_CODE)
    })
  })
  describe("PUT /api/lifts", () => {
    test("should update lift", async () => {
      const newLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }
      const response = await request(app).post("/api/lifts").send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data

      const updatedLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "ruilhe",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }

      const response1 = await request(app)
        .put(`/api/lifts/${lift.cl}`)
        .send(updatedLift)
      expect(response1.status).toBe(200)
      expect(response1.body.message).toBe(MESSAGES.LIFT_UPDATED)
    })

    test("should fail to update lift for missing required fields", async () => {
      const newLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }
      const response = await request(app).post("/api/lifts").send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data

      const updatedLift = {
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "ruilhe",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }

      const response1 = await request(app)
        .put(`/api/lifts/${lift.cl}`)
        .send(updatedLift)
      expect(response1.status).toBe(400)
      expect(response1.body.error).toBe(MESSAGES.MISSING_REQUIRED_FIELDS)
    })
    test("should fail to update lift for invalid lift code", async () => {
      const newLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }
      const response = await request(app).post("/api/lifts").send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data

      const updatedLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "ruilhe",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }

      const response1 = await request(app)
        .put(`/api/lifts/INVALID CODE`)
        .send(updatedLift)
      expect(response1.status).toBe(400)
      expect(response1.body.error).toBe(MESSAGES.LIFT_NOT_FOUND_BY_CODE)
    })
    test("should fail to update lift for driver not found", async () => {
      const newLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }
      const response = await request(app).post("/api/lifts").send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data

      const updatedLift = {
        driver: "INVALID DRIVER",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "ruilhe",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }

      const response1 = await request(app)
        .put(`/api/lifts/${lift.cl}`)
        .send(updatedLift)
      expect(response1.status).toBe(400)
      expect(response1.body.error).toBe(MESSAGES.DRIVER_NOT_FOUND_BY_CODE)
    })
    test("should fail to update lift for car not found", async () => {
      const newLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }
      const response = await request(app).post("/api/lifts").send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data

      const updatedLift = {
        driver: "user",
        car: "INVALID CAR",
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "ruilhe",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }

      const response1 = await request(app)
        .put(`/api/lifts/${lift.cl}`)
        .send(updatedLift)
      expect(response1.status).toBe(400)
      expect(response1.body.error).toBe(MESSAGES.CAR_NOT_FOUND_BY_CODE)
    })
    test("should fail to update lift for same start and end points", async () => {
      const newLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }
      const response = await request(app).post("/api/lifts").send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data

      const updatedLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }

      const response1 = await request(app)
        .put(`/api/lifts/${lift.cl}`)
        .send(updatedLift)
      expect(response1.status).toBe(400)
      expect(response1.body.error).toBe(MESSAGES.MATCHING_START_END)
    })
    test("should fail to update lift for invalid location", async () => {
      const newLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }
      const response = await request(app).post("/api/lifts").send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data

      const updatedLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "INVALID LOCATION",
          municipality: "braga",
          parish: "priscos",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }

      const response1 = await request(app)
        .put(`/api/lifts/${lift.cl}`)
        .send(updatedLift)
      expect(response1.status).toBe(400)
      expect(response1.body.error).toBe(MESSAGES.INVALID_LOCATION)
    })
    test("should fail to update lift for invalid date format", async () => {
      const newLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }
      const response = await request(app).post("/api/lifts").send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data

      const updatedLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "INVALID DATE",
        price: 222,
        providedSeats: 2,
      }

      const response1 = await request(app)
        .put(`/api/lifts/${lift.cl}`)
        .send(updatedLift)
      expect(response1.status).toBe(400)
      expect(response1.body.error).toBe(MESSAGES.INVALID_DATE_FORMAT)
    })
    test("should fail to update lift for invalid date format", async () => {
      const newLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "tadim",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2025/10/10 16:00:00",
        price: 222,
        providedSeats: 2,
      }
      const response = await request(app).post("/api/lifts").send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data

      const updatedLift = {
        driver: "user",
        car: car,
        startPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        endPoint: {
          district: "braga",
          municipality: "braga",
          parish: "priscos",
        },
        schedule: "2022/10/10 10:10:10",
        price: 222,
        providedSeats: 2,
      }

      const response1 = await request(app)
        .put(`/api/lifts/${lift.cl}`)
        .send(updatedLift)
      expect(response1.status).toBe(400)
      expect(response1.body.error).toBe(MESSAGES.DATE_IN_PAST)
    })
  })
})
