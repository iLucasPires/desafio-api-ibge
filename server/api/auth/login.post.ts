import { z } from "zod";
import { eq } from "drizzle-orm";

import { users } from "@/server/db/schema";
import db from "@/server/db/conenct";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const schema = z.object({
    username: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  try {
    schema.parse(body);
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 400,
      message: "Invalid request body",
    });
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, body.username));

  if (result.length === 0) {
    throw createError({
      statusCode: 401,
      message: "Invalid username or password",
    });
  }

  const user = Array.isArray(result) ? result[0] : result;

  if (await verifyPassword(body.password, user.password)) {
    throw createError({
      statusCode: 401,
      message: "Invalid username or password",
    });
  }

  await setUserSession(event, {
    user: {
      name: user.name,
      username: user.username,
      avatar: "",
    },
    loggedInAt: Date.now(),
  });

  return result;
});
