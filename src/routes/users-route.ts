import { Elysia, t } from "elysia";
import { registerUser, loginUser } from "../services/users-services";

export const usersRoute = new Elysia()
	.post(
		"/api/users",
		async ({ body, set }) => {
			try {
				const result = await registerUser(body);
				if (!result.success) {
					set.status = 400;
					return {
						error: result.error,
					};
				}

				return {
					data: result.data,
				};
			} catch (err: any) {
				set.status = 500;
				return {
					error: err?.message || "Internal server error",
				};
			}
		},
		{
			body: t.Object({
				name: t.String(),
				email: t.String(),
				password: t.String(),
			}),
		},
	)
	.post(
		"/api/users/login",
		async ({ body, set }) => {
			try {
				const result = await loginUser(body);
				if (!result.success) {
					set.status = 400;
					return {
						error: result.error,
					};
				}

				return {
					data: result.data,
				};
			} catch (err: any) {
				set.status = 500;
				return {
					error: err?.message || "Internal server error",
				};
			}
		},
		{
			body: t.Object({
				email: t.String(),
				password: t.String(),
			}),
		},
	);
