import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

router.post("/register/admin", UserController.registerAdmin);
router.post("/register/client", UserController.registerClient);
router.put("/profile/:username", UserController.update);

export { router as userRoutes };
