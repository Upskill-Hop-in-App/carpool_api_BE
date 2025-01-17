import express from "express"

import LiftController from "../controllers/liftController.js"
import verifyToken from "../middleware.js"

const router = express.Router()

router.post("/", verifyToken, LiftController.createLift)
router.get("/", verifyToken, LiftController.getAllLifts)
router.get("/cl/:cl", verifyToken, LiftController.getLiftByCode)
router.get("/filter/username/:username", verifyToken, LiftController.filterLifts)
router.put("/:cl", verifyToken, LiftController.updateLiftByCode)
router.delete("/:cl", verifyToken, LiftController.deleteLiftByCode)

export { router as liftRoutes }
