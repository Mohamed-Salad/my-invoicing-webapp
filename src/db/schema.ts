import { pgTable, timestamp, serial, text, varchar,integer, pgEnum,  } from "drizzle-orm/pg-core";

export const statusEnum= pgEnum('status',['open','void','paid','uncollectable']);

export const Invoices = pgTable('invoices', {
  id: serial('id').primaryKey().notNull(),
  createTS: timestamp('createTs').defaultNow().notNull(),
  value: integer('value').notNull(),
  description: text('description').notNull(),
  status:statusEnum("status").notNull(),
});
