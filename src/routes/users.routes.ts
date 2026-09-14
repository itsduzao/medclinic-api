import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { userRole } from "../entities/User";
import { AuthHandler } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

export const userRouter = Router();

const userController = new UserController();

userRouter.get("/me", AuthHandler, (req, res) =>
	userController.getUserProfile(req, res),
);

userRouter.get("/ping", AuthHandler, requireRole(userRole.ADMIN), (req, res) =>
	userController.welcomeAuthorizedPerson(req, res),
);
