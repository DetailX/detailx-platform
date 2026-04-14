import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["firm", "buyer", "admin"] }).notNull().default("buyer"),
  firmName: text("firm_name"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const details = sqliteTable("details", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  buildingType: text("building_type").notNull(),
  firmId: text("firm_id")
    .notNull()
    .references(() => users.id),
  previewImageKey: text("preview_image_key").notNull(),
  detailFileKeys: text("detail_file_keys").notNull(), // JSON array of S3 keys
  price: integer("price").notNull(), // in cents
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const purchases = sqliteTable(
  "purchases",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    detailId: text("detail_id")
      .notNull()
      .references(() => details.id),
    amount: integer("amount").notNull(),
    status: text("status").notNull().default("completed"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("unique_user_detail").on(table.userId, table.detailId),
  ]
);

export const uploads = sqliteTable("uploads", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  projectName: text("project_name").notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(), // pdf, dwg, dxf, jpg, etc.
  status: text("status", { enum: ["pending", "processing", "completed", "failed"] })
    .notNull()
    .default("pending"),
  location: text("location").notNull(),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type Detail = typeof details.$inferSelect;
export type Purchase = typeof purchases.$inferSelect;
export type Upload = typeof uploads.$inferSelect;
