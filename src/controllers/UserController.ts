import type { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { UserService } from "../services/UserService";

const userService = new UserService();

export class UserController {
	async getUserProfile(req: Request, res: Response): Promise<Response> {
		const { user } = req;

		if (!user) {
			throw new AppError("Unauthorized", 401);
		}

		const result = await userService.getUser(user);

		return res.status(200).json(result);
	}

	async welcomeAuthorizedPerson(
		req: Request,
		res: Response,
	): Promise<Response> {
		const { user } = req;

		if (!user) {
			throw new AppError("Unauthorized", 401);
		}

		const { name, role } = await userService.getUser(user);

		return res.status(200).json({
			message: `Welcome, ${name}. You reached a route allowd to ${role}.`,
		});
	}
}
