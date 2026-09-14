import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsString,
	MinLength,
} from "class-validator";
import { userRole } from "../entities/User";

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	name!: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password!: string;

	@IsEmail()
	@IsNotEmpty()
	email!: string;

	@IsEnum(userRole)
	@IsNotEmpty()
	role!: userRole;
}
