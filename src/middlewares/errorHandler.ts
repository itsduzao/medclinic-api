import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export function errorHandler(
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	if (err instanceof AppError) {
		const validationDetails = err.validationErrors
			?.map(
				({ field, message, value }) =>
					`- ${field}: ${message}${value !== undefined ? ` (value: ${String(value)})` : ""}`,
			)
			.join("\n");

		console.error(
			[
				err.stack,
				validationDetails && `Validation errors:\n${validationDetails}`,
			]
				.filter(Boolean)
				.join("\n"),
		);

		return res.status(err.statusCode).json({
			status: "error",
			message: err.message,
			...(err.validationErrors?.length && { errors: err.validationErrors }),
		});
	}

	console.error(err);

	return res.status(500).json({
		status: "error",
		message: "Internal server error",
	});
}
