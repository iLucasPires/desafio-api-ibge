import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import db from "../db/conenct";

interface User {
  username: string;
  name: string;
  password?: string;
}
export async function createUser(user: User) {
  const exists = await db
    .select()
    .from(users)
    .where(eq(users.username, user.username));

  if (exists.length > 0) return exists; 

  const result = await db.insert(users).values({
    username: user.username,
    name: user.name,
    avatar: "",
    password: user.password || "",
  });
  console.log(result);

  if (!result) {
    throw new Error("Error creating user"); 
  }

  return result;
}