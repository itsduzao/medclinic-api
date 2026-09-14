import type { Response } from "express";
import type { CreateUserDto } from "../dtos/CreateUserDto";
import type { LoginDto } from "../dtos/LoginDto";
import { AuthService } from "../services/AuthService";
import type { TypedBodyRequest } from "../types/express";

const authService = new AuthService();

export class AuthController {
	async register(
		req: TypedBodyRequest<CreateUserDto>,
		res: Response,
	): Promise<Response> {
		const { email, name, password, role } = req.body;

		const user = await authService.createUser({
			email,
			name,
			password,
			role,
		});

		return res.status(201).json({
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		});
	}

	async login(
		req: TypedBodyRequest<LoginDto>,
		res: Response,
	): Promise<Response> {
		const result = await authService.login(req.body);
		return res.status(200).json(result);
	}
}
