import express from "express"
import UserController from "../controllers/userController.js"

const router = express.Router()

router.post("/register/admin", UserController.registerAdmin)
router.post("/register/client", UserController.registerClient)
router.post("/login", UserController.login)
router.put("/profile/:username", UserController.update)
router.put("/password/:username", UserController.updatePassword)
router.put("/driverRating/:username", UserController.updateDriverRating)
router.put("/passengerRating/:username", UserController.updatePassengerRating)
router.put("/delete/:username", UserController.anonymize)
router.delete("/:username", UserController.delete)

export { router as userRoutes }
