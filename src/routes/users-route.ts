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
  });
