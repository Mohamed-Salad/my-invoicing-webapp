import { pgTable, timestamp, serial, text, integer, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const poolStatusEnum = pgEnum('pool_status', ['active', 'closed']);

export const Pools = pgTable('pools', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  totalAmount: integer('total_amount').notNull(),
  perPersonAmount: integer('per_person_amount'),
  hostName: text('host_name').notNull(),
  slug: text('slug').notNull().unique(),
  status: poolStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const Participants = pgTable('participants', {
  id: serial('id').primaryKey().notNull(),
  poolId: integer('pool_id').notNull().references(() => Pools.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  amountOwed: integer('amount_owed').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const Payments = pgTable('payments', {
  id: serial('id').primaryKey().notNull(),
  poolId: integer('pool_id').notNull().references(() => Pools.id, { onDelete: 'cascade' }),
  payerName: text('payer_name').notNull(),
  amount: integer('amount').notNull(),
  note: text('note'),
  participantId: integer('participant_id').references(() => Participants.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const poolsRelations = relations(Pools, ({ many }) => ({
  participants: many(Participants),
  payments: many(Payments),
}));

export const participantsRelations = relations(Participants, ({ one }) => ({
  pool: one(Pools, { fields: [Participants.poolId], references: [Pools.id] }),
}));

export const paymentsRelations = relations(Payments, ({ one }) => ({
  pool: one(Pools, { fields: [Payments.poolId], references: [Pools.id] }),
  participant: one(Participants, { fields: [Payments.participantId], references: [Participants.id] }),
}));
