import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const dbPath = process.env.TURSO_DATABASE_URL
  ? process.env.TURSO_DATABASE_URL
  : `file:${path.join(process.cwd(), "sqlite.db")}`;

const client = createClient({
  url: dbPath,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  console.log("Applying migration...");

  await client.execute(`
    CREATE TABLE IF NOT EXISTS \`uploads\` (
      \`id\` text PRIMARY KEY NOT NULL,
      \`user_id\` text,
      \`project_name\` text NOT NULL,
      \`file_name\` text NOT NULL,
      \`file_type\` text NOT NULL,
      \`status\` text DEFAULT 'pending' NOT NULL,
      \`location\` text NOT NULL,
      \`notes\` text,
      \`created_at\` integer NOT NULL,
      FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE no action
    )
  `);

  console.log("Migration applied: uploads table created.");
  await client.close();
}

migrate().catch((e) => {
  console.error(e);
  process.exit(1);
});
