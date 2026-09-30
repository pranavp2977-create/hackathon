// server/migrate.ts
import { initDatabase } from './db';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  console.log('Running database migrations and checking connection...');
  await initDatabase();
  console.log('Migration task completed successfully.');
  process.exit(0);
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
