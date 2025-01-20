import request from "supertest"

import { MESSAGES } from "../src/utils/responseMessages.js"
import { app } from "../src/app.js"
import { adminToken, clientToken, client2Token } from "./setup/testSetup.js"

let car
let lift

describe("Lift Tests", () => {
  beforeAll(async () => {
    /* ---------------------- Create prerequisites for test --------------------- */
    const newCar = {
      brand: "toyota",
      model: "yaris",
      year: 2004,
      user: "client_name",
      color: "pink",
      plate: "22-22-AA",
    }
    const carResponse = await request(app)
      .post("/api/cars")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newCar)
    expect(carResponse.status).toBe(201)
    car = carResponse.body.data.cc
  })

  describe("POST /api/lifts", () => {
    test("should return no lifts from empty DB", async () => {
      const response = await request(app)
        .get("/api/lifts")
        .set("Authorization", `Bearer ${adminToken}`)
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
      const response = await request(app)
        .post("/api/lifts")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newLift)

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
      const response = await request(app)
        .post("/api/lifts")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newLift)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.DRIVER_NOT_FOUND_BY_CODE)
    })

    test("should fail to create new lift for car not found", async () => {
      const newLift = {
        driver: "client_name",
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
      const response = await request(app)
        .post("/api/lifts")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newLift)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.CAR_NOT_FOUND_BY_CODE)
    })

    test("should fail to create new lift for same start and end points", async () => {
      const newLift = {
        driver: "client_name",
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
      const response = await request(app)
        .post("/api/lifts")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newLift)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.MATCHING_START_END)
    })

    test("should fail to create new lift for invalid location", async () => {
      const newLift = {
        driver: "client_name",
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
      const response = await request(app)
        .post("/api/lifts")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newLift)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.INVALID_LOCATION)
    })

    test("should fail to create new lift for invalid date format", async () => {
      const newLift = {
        driver: "client_name",
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
      const response = await request(app)
        .post("/api/lifts")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newLift)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.INVALID_DATE_FORMAT)
    })

    test("should fail to create new lift for invalid date format", async () => {
      const newLift = {
        driver: "client_name",
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
      const response = await request(app)
        .post("/api/lifts")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newLift)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(MESSAGES.DATE_IN_PAST)
    })

    test("should create new lift", async () => {
      const newLift = {
        driver: "client_name",
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
      const response = await request(app)
        .post("/api/lifts")
        .set("Authorization", `Bearer ${clientToken}`)
        .send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data
    })
  })
  describe("GET /api/lifts", () => {
    test("should return all lifts", async () => {
      const response = await request(app)
        .get("/api/lifts")
        .set("Authorization", `Bearer ${clientToken}`)
      expect(response.status).toBe(200)
      expect(response.body.message).toBe(MESSAGES.LIFTS_RETRIEVED)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data.length).toBeGreaterThan(0)
    })

    test("should return lift by code", async () => {
      const newLift = {
        driver: "client_name",
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
      const response = await request(app)
        .post("/api/lifts")
        .set("Authorization", `Bearer ${clientToken}`)
        .send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data

      const response1 = await request(app)
        .get(`/api/lifts/cl/${lift.cl}`)
        .set("Authorization", `Bearer ${clientToken}`)
      expect(response1.status).toBe(200)
      expect(response1.body.message).toBe(MESSAGES.LIFT_RETRIEVED_BY_CODE)
    })
  })
  describe("PUT /api/lifts", () => {
    let application
    test("should update lift", async () => {
      const newLift = {
        driver: "client_name",
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
      const response = await request(app)
        .post("/api/lifts")
        .set("Authorization", `Bearer ${clientToken}`)
        .send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data

      const updatedLift = {
        driver: "client_name",
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
        .set("Authorization", `Bearer ${clientToken}`)
        .send(updatedLift)
      expect(response1.status).toBe(200)
      expect(response1.body.message).toBe(MESSAGES.LIFT_UPDATED)
    })

    test("should fail to update lift for missing required fields", async () => {
      const newLift = {
        driver: "client_name",
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
      const response = await request(app)
        .post("/api/lifts")
        .set("Authorization", `Bearer ${clientToken}`)
        .send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data

      const updatedLift = {
        driver: "client_name",
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
        .set("Authorization", `Bearer ${clientToken}`)
        .send(updatedLift)
      expect(response1.status).toBe(400)
      expect(response1.body.error).toBe(MESSAGES.MISSING_REQUIRED_FIELDS)
    })

    test("should fail to update lift for invalid lift code", async () => {
      const newLift = {
        driver: "client_name",
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
      const response = await request(app)
        .post("/api/lifts")
        .set("Authorization", `Bearer ${clientToken}`)
        .send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data

      const updatedLift = {
        driver: "client_name",
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
        .set("Authorization", `Bearer ${clientToken}`)
        .send(updatedLift)
      expect(response1.status).toBe(400)
      expect(response1.body.error).toBe(MESSAGES.LIFT_NOT_FOUND_BY_CODE)
    })

    test("should fail to update lift for driver not found", async () => {
      const newLift = {
        driver: "client_name",
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
      const response = await request(app)
        .post("/api/lifts")
        .set("Authorization", `Bearer ${clientToken}`)
        .send(newLift)

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
        .set("Authorization", `Bearer ${clientToken}`)
        .send(updatedLift)
      expect(response1.status).toBe(403)
      expect(response1.body.error).toBe(MESSAGES.ACCESS_DENIED)
    })

    test("should fail to update lift for car not found", async () => {
      const newLift = {
        driver: "client_name",
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
      const response = await request(app)
        .post("/api/lifts")
        .set("Authorization", `Bearer ${clientToken}`)
        .send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data

      const updatedLift = {
        driver: "client_name",
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
        .set("Authorization", `Bearer ${clientToken}`)
        .send(updatedLift)
      expect(response1.status).toBe(400)
      expect(response1.body.error).toBe(MESSAGES.CAR_NOT_FOUND_BY_CODE)
    })

    test("should fail to update lift for same start and end points", async () => {
      const newLift = {
        driver: "client_name",
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
      const response = await request(app)
        .post("/api/lifts")
        .set("Authorization", `Bearer ${clientToken}`)
        .send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data

      const updatedLift = {
        driver: "client_name",
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
        .set("Authorization", `Bearer ${clientToken}`)
        .send(updatedLift)
      expect(response1.status).toBe(400)
      expect(response1.body.error).toBe(MESSAGES.MATCHING_START_END)
    })

    test("should fail to update lift for invalid location", async () => {
      const newLift = {
        driver: "client_name",
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
      const response = await request(app)
        .post("/api/lifts")
        .set("Authorization", `Bearer ${clientToken}`)
        .send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data

      const updatedLift = {
        driver: "client_name",
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
        .set("Authorization", `Bearer ${clientToken}`)
        .send(updatedLift)
      expect(response1.status).toBe(400)
      expect(response1.body.error).toBe(MESSAGES.INVALID_LOCATION)
    })

    test("should fail to update lift for invalid date format", async () => {
      const newLift = {
        driver: "client_name",
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
      const response = await request(app)
        .post("/api/lifts")
        .set("Authorization", `Bearer ${clientToken}`)
        .send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data

      const updatedLift = {
        driver: "client_name",
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
        .set("Authorization", `Bearer ${clientToken}`)
        .send(updatedLift)
      expect(response1.status).toBe(400)
      expect(response1.body.error).toBe(MESSAGES.INVALID_DATE_FORMAT)
    })

    test("should fail to update lift for invalid date format", async () => {
      const newLift = {
        driver: "client_name",
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
      const response = await request(app)
        .post("/api/lifts")
        .set("Authorization", `Bearer ${clientToken}`)
        .send(newLift)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe(MESSAGES.LIFT_CREATED)
      lift = response.body.data

      const updatedLift = {
        driver: "client_name",
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
        .set("Authorization", `Bearer ${clientToken}`)
        .send(updatedLift)
      expect(response1.status).toBe(400)
      expect(response1.body.error).toBe(MESSAGES.DATE_IN_PAST)
    })

    test("should update lift status and ratings", async () => {
      const newApplication = {
        passenger: "client2_name",
        lift: lift.cl,
      }

      const response = await request(app)
        .post(`/api/applications`)
        .set("Authorization", `Bearer ${client2Token}`)
        .send(newApplication)
      expect(response.status).toBe(201)
      application = response.body.data

      const response1 = await request(app)
        .put(`/api/applications/accept/${application.ca}`)
        .set("Authorization", `Bearer ${clientToken}`)
      expect(response1.status).toBe(200)

      const response2 = await request(app)
        .put(`/api/applications/ready/${application.ca}`)
        /* .set("Authorization", `Bearer ${clientToken}`) */
      expect(response2.status).toBe(200)

      const response3 = await request(app)
        .put(`/api/lifts/cl/status/${lift.cl}/inProgress`)
        /* .set("Authorization", `Bearer ${clientToken}`) */
      expect(response3.status).toBe(200)
      expect(response3.body.data.status).toBe("inProgress")

      const response4 = await request(app)
        .put(`/api/lifts/cl/status/${lift.cl}/finished`)
        /* .set("Authorization", `Bearer ${clientToken}`) */
      expect(response4.status).toBe(200)
      expect(response4.body.data.status).toBe("finished")

      const response5 = await request(app)
        .put(`/api/lifts/cl/rating/${lift.cl}/4`)
        /* .set("Authorization", `Bearer ${client2Token}`) */
      expect(response5.status).toBe(200)
      expect(response5.body.data.receivedDriverRatings).toContain(4)

      const response6 = await request(app)
        .put(`/api/applications/ca/rating/${application.ca}/4`)
        /* .set("Authorization", `Bearer ${clientToken}`) */
      expect(response6.status).toBe(200)
      expect(response6.body.data.receivedPassengerRating).toBe(4)

      const response7 = await request(app)
        .put(`/api/lifts/cl/status/${lift.cl}/closed`)
        /* .set("Authorization", `Bearer ${clientToken}`) */
      expect(response7.status).toBe(200)
      expect(response7.body.data.status).toBe("closed")
    })
  })
})
