import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
    process.exit(1);
  }

  console.log("Connecting to Turso:", url);

  const client = createClient({ url, authToken });

  // Test connection
  const result = await client.execute("SELECT 1 as test");
  console.log("Connection successful:", result.rows);

  // Read and apply the migration SQL
  const migrationPath = path.join(__dirname, "../drizzle/0000_aromatic_supreme_intelligence.sql");
  const sql = fs.readFileSync(migrationPath, "utf-8");

  // Split by statement separator and execute each
  const statements = sql
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Applying ${statements.length} statements...`);

  for (const stmt of statements) {
    console.log("Executing:", stmt.substring(0, 60) + "...");
    await client.execute(stmt);
  }

  console.log("Schema applied successfully!");
  client.close();
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
