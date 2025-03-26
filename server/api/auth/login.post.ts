import { eq } from "drizzle-orm";

import { users } from "@/server/db/schema";
import db from "@/server/db/conenct";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, body.username));

  if (result.length === 0) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid username or password",
    });
  }

  const user = Array.isArray(result) ? result[0] : result;

  if (user.password !== body.password) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid username or password",
    });
  }

  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
    },
    loggedInAt: Date.now(),
  });

  return result;
});
