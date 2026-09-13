import type { userRole } from "../entities/User";

export type AuthUser = {
	id: number;
	role: userRole;
};
