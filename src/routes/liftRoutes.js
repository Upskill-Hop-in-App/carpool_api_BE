import express from "express"

import LiftController from "../controllers/liftController.js"
import verifyToken from "../middleware.js"

const router = express.Router()

router.post("/", verifyToken, LiftController.createLift)
router.get("/", verifyToken, LiftController.getAllLifts)
router.get("/cl/:cl", verifyToken, LiftController.getLiftByCode)
router.get("/username/:username", verifyToken, LiftController.getLiftByUsername)
router.get(
  "/filter/username/:username",
  verifyToken,
  LiftController.filterLifts
)
router.put("/cl/status/:cl/:status", LiftController.updateLiftStatusByCode)
router.put("/cl/rating/:cl/:rating", LiftController.updateDriverRatingsByCode)
router.put("/:cl", verifyToken, LiftController.updateLiftByCode)
router.delete("/:cl", verifyToken, LiftController.deleteLiftByCode)

export { router as liftRoutes }
