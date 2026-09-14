export interface ValidationErrorDetail {
	field: string;
	message: string;
	value?: unknown;
}

export class AppError extends Error {
	public readonly statusCode: number;
	public readonly validationErrors?: ValidationErrorDetail[];

	constructor(
		message: string,
		statusCode = 400,
		validationErrors?: ValidationErrorDetail[],
	) {
		super(message);
		this.statusCode = statusCode;
		this.validationErrors = validationErrors ?? [];
	}
}
