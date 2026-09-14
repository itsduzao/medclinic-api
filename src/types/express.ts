import type { Request } from "express";
import type { userRole } from "../entities/User";

export type AuthUser = {
	id: number;
	role: userRole;
};

export type RouteParams = Record<string, string | string[] | undefined>;

export type TypedBodyRequest<
	TBody,
	TParams extends RouteParams = RouteParams,
> = Request<TParams, unknown, TBody>;
