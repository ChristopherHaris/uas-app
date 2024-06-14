import { sql } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";

export const users = sqliteTable("users", {
  id: text("id").$defaultFn(() => uuidv4()),
  name: text("name").notNull(),
  password: text("password").notNull(),
});

export const books = sqliteTable("books", {
  id: text("id").$defaultFn(() => uuidv4()),
  name: text("name")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  author: text("author").notNull(),
  releaseDate: text("releaseDate").notNull(),
  bookUrl: text("bookUrl").notNull(),
  imageUrl: text("imageUrl").notNull(),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").default(sql`CURRENT_TIMESTAMP`),
});
