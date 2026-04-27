import { Elysia, t } from "elysia";
import { usersService } from "../services/users-service";

export const usersRoute = new Elysia()
  .post("/register", async ({ body, set }) => {
    try {
      const result = await usersService.registerUser(body);
      set.status = 201;
      return result;
    } catch (error: any) {
      if (error.message === "User already exists") {
        set.status = 409;
        return { message: "User already exists" };
      }
      set.status = 400;
      return { message: error.message || "Bad request" };
    }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String(),
    })
  })
  .post("/login", async ({ body, set }) => {
    try {
      return await usersService.loginUser(body);
    } catch (error: any) {
      set.status = 401;
      return { error: error.message || "Email or password wrong" };
    }
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    })
  })
  .derive(({ headers }) => {
    const auth = headers.authorization;
    return {
      token: auth?.startsWith("Bearer ") ? auth.slice(7) : null
    };
  })
  .post("/current", async ({ token, set }) => {
    if (!token) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    try {
      return await usersService.getCurrentUser(token);
    } catch (error: any) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
  })
  .post("/logout", async ({ token, set }) => {
    if (!token) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    try {
      return await usersService.logoutUser(token);
    } catch (error: any) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
  });
