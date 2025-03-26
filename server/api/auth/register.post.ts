import { eq } from "drizzle-orm";

import { users } from "@/server/db/schema";
import db from "@/server/db/conenct";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

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
    password: body.password || "",
  });

  if (!result) {
    throw new Error("Error creating user");
  }

  const newUser = Array.isArray(result) ? result[0] : result;

  await setUserSession(event, {
    user: {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username,
      avatar: newUser.avatar,
    },
    loggedInAt: Date.now(),
  });

  return newUser;
});
