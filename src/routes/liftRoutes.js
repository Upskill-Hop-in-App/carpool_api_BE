import express from "express"

import LiftController from "../controllers/liftController.js"

const router = express.Router()

router.post("/", LiftController.createLift)
router.get("/", LiftController.getAllLifts)
router.get("/cl/:cl", LiftController.getLiftByCode)
router.get("/filter", LiftController.filterLifts)
router.put("/cl/status/:cl/:status", LiftController.updateLiftStatusByCode)
router.put("/cl/rating/:cl/:rating", LiftController.updateDriverRatingsByCode)
router.put("/:cl", LiftController.updateLiftByCode)
router.delete("/:cl", LiftController.deleteLiftByCode)

export { router as liftRoutes }
