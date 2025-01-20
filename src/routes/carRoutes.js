import express from "express"

import CarController from "../controllers/carController.js"
import verifyToken from "../middleware.js"

const router = express.Router()

router.post("/", verifyToken, CarController.createCar)
router.get("/filter/username/:username", verifyToken, CarController.filterCars)
router.get("/username/:username", verifyToken, CarController.getCarByUsername)
router.put("/:cc", verifyToken, CarController.updateCarByCode)
router.delete("/:cc", verifyToken, CarController.deleteCarByCode)

export { router as carRoutes }
