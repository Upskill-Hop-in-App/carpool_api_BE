import express from "express"

import CarController from "../controllers/carController.js"

const router = express.Router()

router.post("/", CarController.createCar)
router.get("/", CarController.getAllCars)
router.get("/cc/:cc", CarController.getCarByCode)
router.put("/:cc", CarController.updateCarByCode)
router.delete("/:cc", CarController.deleteCarByCode)

export { router as carRoutes }
