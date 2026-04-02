import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import path from "path";

const dbPath = process.env.TURSO_DATABASE_URL
  ? process.env.TURSO_DATABASE_URL
  : `file:${path.join(process.cwd(), "sqlite.db")}`;

const client = createClient({
  url: dbPath,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
