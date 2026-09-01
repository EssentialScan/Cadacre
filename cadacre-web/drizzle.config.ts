import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // Only read when actually applying migrations (db:migrate) — `db:generate`
    // just diffs the TS schema against the checked-in migration folder and
    // doesn't need a live connection.
    url: process.env.DATABASE_URL ?? "postgres://placeholder",
  },
});
