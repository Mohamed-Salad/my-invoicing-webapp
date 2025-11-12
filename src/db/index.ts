import {drizzle} from 'drizzle-orm/node-postgres';
// db.ts
import { Pool } from 'pg';
import { Invoices } from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const db = drizzle(pool,
  {schema:
    {Invoices

    }
  }
);
