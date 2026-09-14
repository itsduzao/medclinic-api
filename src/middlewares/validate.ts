import { type ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

async function formatValidationErrors<TDto extends object>(dto: TDto) {
	const errors = await validate(dto);
	return errors.flatMap((error) => {
		const constraints = Object.values(error.constraints ?? {});

		return constraints.map((message) => ({
			field: error.property,
			message,
			value: error.value,
		}));
	});
}

export function validateDto<TDto extends object>(
	dtoClass: ClassConstructor<TDto>,
) {
	return async function validateDtoMiddleware(
		req: Request,
		_res: Response,
		next: NextFunction,
	) {
		const isGetRequestMethod = req.method === "GET";
		const targetToDtoConversion = isGetRequestMethod ? req.query : req.body;

		const dto = plainToInstance(dtoClass, targetToDtoConversion) as TDto;
		const validationErrors = await formatValidationErrors(dto);

		if (validationErrors.length > 0) {
			throw new AppError("Validation failed", 400, validationErrors);
		}

		if (isGetRequestMethod) {
			Object.assign(req, { query: dto });
			return next();
		}

		Object.assign(req, { body: dto });
		return next();
	};
}
