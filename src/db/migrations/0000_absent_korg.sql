-- ChipIn schema: pools, participants, payments
DROP TABLE IF EXISTS "payments";
DROP TABLE IF EXISTS "participants";
DROP TABLE IF EXISTS "pools";
DROP TABLE IF EXISTS "invoices";
DROP TYPE IF EXISTS "pool_status";
DROP TYPE IF EXISTS "status";

CREATE TYPE "pool_status" AS ENUM('active', 'closed');--> statement-breakpoint

CREATE TABLE "pools" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "total_amount" integer NOT NULL,
  "per_person_amount" integer,
  "creator_username" text NOT NULL,
  "slug" text NOT NULL,
  "status" "pool_status" DEFAULT 'active' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "pools_slug_unique" UNIQUE("slug")
);--> statement-breakpoint

CREATE TABLE "participants" (
  "id" serial PRIMARY KEY NOT NULL,
  "pool_id" integer NOT NULL,
  "name" text NOT NULL,
  "amount_owed" integer NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE "payments" (
  "id" serial PRIMARY KEY NOT NULL,
  "pool_id" integer NOT NULL,
  "payer_name" text NOT NULL,
  "amount" integer NOT NULL,
  "note" text,
  "participant_id" integer,
  "created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint

ALTER TABLE "participants" ADD CONSTRAINT "participants_pool_id_pools_id_fk" FOREIGN KEY ("pool_id") REFERENCES "pools"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_pool_id_pools_id_fk" FOREIGN KEY ("pool_id") REFERENCES "pools"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "participants"("id");
