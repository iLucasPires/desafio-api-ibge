export default defineTask({
  meta: {
    name: "db:migrate",
    description: "Run database migrations",
  },
  async run({ payload, context }) {
    const db = useDatabase();
    try {
      await db.sql`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT,
        avatar TEXT
      );
    `;
    } catch (error) {
      console.error(error);
    }

    return { result: "Success" };
  },
});
