import { z } from "zod";
import { eq } from "drizzle-orm";

import { users } from "@/server/db/schema";
import db from "@/server/db/conenct";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const schema = z.object({
    name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
    username: z.string().email("Insira um email válido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  });

  try {
    schema.parse(body);
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 400,
      message: "Dados não informados corretamente ou faltando",
    });
  }

  const exists = await db
    .select()
    .from(users)
    .where(eq(users.username, body.username));

  if (exists.length > 0) {
    setResponseStatus(event, 409);
    return {
      message: "User already exists",
    };
  }

  const result = await db.insert(users).values({
    username: body.username,
    name: body.name,
    avatar: "",
    password: await hashPassword(body.password),
  });

  if (!result) {
    throw new Error("Error creating user");
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, body.username));

  if (user.length === 0) {
    throw createError({
      statusCode: 500,
      message: "Error creating user",
    });
  }

  const newUser = Array.isArray(user) ? user[0] : user;

  await setUserSession(event, {
    user: {
      name: newUser.name,
      username: newUser.username,
      avatar: "",
    },
    loggedInAt: Date.now(),
  });

  return newUser;
});
