import dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config({ path: "./.env.local" });

if (!process.env.NEXT_PUBLIC_POSTGRES_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: { connectionString: process.env.NEXT_PUBLIC_POSTGRES_URL },
} satisfies Config;
