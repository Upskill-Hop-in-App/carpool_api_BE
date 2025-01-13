import express from "express"

import ApplicationController from "../controllers/applicationController.js"

const router = express.Router()

router.post("/", ApplicationController.createApplication)
router.get("/", ApplicationController.getAllApplications)
router.get("/ca/:ca", ApplicationController.getApplicationByCode)
router.get(
  "/username/:username",
  ApplicationController.getApplicationsByUsername
)
router.get("/email/:email", ApplicationController.getApplicationsByEmail)
router.get("/status/:status", ApplicationController.getApplicationsByStatus)
router.get(
  "/username/status/:username/:status",
  ApplicationController.getApplicationsByUsernameAndStatus
)
router.get(
  "/email/status/:email/:status",
  ApplicationController.getApplicationsByEmailAndStatus
)

export { router as applicationRoutes }
