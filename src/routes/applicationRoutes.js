import express from "express"

import ApplicationController from "../controllers/applicationController.js"
import verifyToken from "../middleware.js"

const router = express.Router()

router.post("/", verifyToken, ApplicationController.createApplication)
router.get("/", verifyToken, ApplicationController.getAllApplications)
router.get("/ca/:ca", verifyToken, ApplicationController.getApplicationByCode)
router.get(
  "/username/:username",
  verifyToken,
  ApplicationController.getApplicationsByUsername
)
router.get(
  "/email/:email",
  verifyToken,
  ApplicationController.getApplicationsByEmail
)
router.get(
  "/status/:status",
  verifyToken,
  ApplicationController.getApplicationsByStatus
)
router.get(
  "/username/status/:username/:status",
  verifyToken,
  ApplicationController.getApplicationsByUsernameAndStatus
)
router.get(
  "/email/status/:email/:status",
  verifyToken,
  ApplicationController.getApplicationsByEmailAndStatus
)
router.get("/filter", verifyToken, ApplicationController.filterApplications)
router.get(
  "/filter/username/:username",
  verifyToken,
  ApplicationController.filterApplications
)
router.put("/accept/:ca", verifyToken, ApplicationController.accept)
router.put("/reject/:ca", verifyToken, ApplicationController.reject)
router.put("/cancel/:ca", verifyToken, ApplicationController.cancel)

export { router as applicationRoutes }
