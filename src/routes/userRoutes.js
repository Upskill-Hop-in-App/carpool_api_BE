import express from "express"
import UserController from "../controllers/userController.js"
import verifyToken from "../middleware.js"

const router = express.Router()

router.post("/login", verifyToken, UserController.login)
router.post("/register/client", verifyToken, UserController.registerClient)
router.post("/register/admin", verifyToken, UserController.registerAdmin)
router.put("/profile/:username", verifyToken, UserController.update)
router.put("/password/:username", verifyToken, UserController.updatePassword)
router.put("/delete/:username", verifyToken, UserController.delete)
router.delete("/:username", verifyToken, UserController.delete)

export { router as userRoutes }
