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
