import { eq } from "drizzle-orm";

import { users } from "@/server/db/schema";
import db from "@/server/db/conenct";

export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user }) {
    const exists = await db
      .select()
      .from(users)
      .where(eq(users.username, user.login));

    if (exists.length > 0) {
      const result = await db.insert(users).values({
        username: user.login,
        name: user.name,
        avatar: "",
        password: "",
      });
      console.log(result);
    }

    await setUserSession(event, {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
      },
    });

    return sendRedirect(event, "/");
  },

  onError(event, error) {
    console.error("Google OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
