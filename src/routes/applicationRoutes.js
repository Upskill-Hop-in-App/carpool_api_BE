import express from "express"

import ApplicationController from "../controllers/applicationController.js"

const router = express.Router()

router.post("/", ApplicationController.createApplication)


export { router as applicationRoutes }