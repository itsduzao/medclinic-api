import pgDataSource from "../database/pg-data-source";
import { User } from "../entities/User";
import { AppError } from "../errors/AppError";
import type { AuthUser } from "../types/express";

type UserResult = Pick<User, "id" | "name" | "email" | "role">;

export class UserService {
	private async getUserRepository() {
		return pgDataSource.getRepository(User);
	}

	async getUser(data: AuthUser): Promise<UserResult> {
		const userRepository = await this.getUserRepository();

		const user = await userRepository.findOneBy({ id: data.id });

		if (!user) {
			throw new AppError("User does not exist", 404);
		}

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		};
	}
}
