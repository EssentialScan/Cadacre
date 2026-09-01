// Manually run before a schema-changing deploy: `npm run db:migrate`.
// Not auto-run at boot — this is real subscriber data, migrations should be
// a deliberate, reviewed step (same convention as the checked-in SQL files
// under src/db/migrations, generated via `npm run db:generate`).
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set — nothing to migrate.");
  process.exit(1);
}

const db = drizzle(neon(url));

migrate(db, { migrationsFolder: "./src/db/migrations" })
  .then(() => {
    console.error("Migrations applied.");
  })
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
