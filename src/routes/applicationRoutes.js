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
router.get("/filter", ApplicationController.filterApplications)
router.get(
  "/filter/username/:username",
  ApplicationController.filterApplications
)
router.put("/accept/:ca", ApplicationController.accept)
router.delete("/:ca", ApplicationController.delete)

export { router as applicationRoutes }
