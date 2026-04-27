import { db } from "../db";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const usersService = {
  async registerUser(data: any) {
    const { name, email, password } = data;

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    return { message: "User created successfully" };
  },

  async loginUser(data: any) {
    const { email, password } = data;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new Error("Email or password wrong");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error("Email or password wrong");
    }

    const token = crypto.randomUUID();

    await db.insert(sessions).values({
      token,
      userId: user.id,
    });

    return { data: token };
  },

  async getCurrentUser(token: string) {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.token, token))
      .limit(1);

    const user = result[0];

    if (!user) {
      throw new Error("Unauthorized");
    }

    return { data: user };
  },

  async logoutUser(token: string) {
    const session = await db.query.sessions.findFirst({
      where: eq(sessions.token, token),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    await db.delete(sessions).where(eq(sessions.token, token));

    return { data: "Ok" };
  },
};
