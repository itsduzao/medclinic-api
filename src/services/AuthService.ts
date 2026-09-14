import type { CreateUserDto } from "../dtos/CreateUserDto";
import type { User } from "../entities/User";
import { AppError } from "../errors/AppError";
import { userRepository } from "../repositories/UserRepository";
import { hashPassword } from "../utils/password";

export class AuthService {
	async createUser(data: CreateUserDto): Promise<User> {
		const existingUser = await userRepository.findOneBy({
			email: data.email,
		});

		if (existingUser) {
			throw new AppError("User already exists", 409);
		}

		const user = userRepository.create({
			...data,
			password: await hashPassword(data.password),
		});

		return userRepository.save(user);
	}
}
