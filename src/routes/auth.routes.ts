import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { CreateUserDto } from "../dtos/CreateUserDto";
import { LoginDto } from "../dtos/LoginDto";
import { validateDto } from "../middlewares/validate";

export const authRouter = Router();

const authController = new AuthController();

authRouter.post("/register", validateDto(CreateUserDto), (req, res) =>
	authController.register(req, res),
);

authRouter.post("/login", validateDto(LoginDto), (req, res) =>
	authController.login(req, res),
);
