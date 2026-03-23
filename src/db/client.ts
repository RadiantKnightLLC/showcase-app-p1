import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import * as schema from './schema';

let client: PGlite | null = null;
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export async function initDatabase() {
  if (client) return { client, db };

  // Initialize PGlite with IndexedDB persistence
  client = new PGlite('idb://tictactoe-db');
  
  // Wait for client to be ready
  await client.waitReady;
  
  // Create drizzle instance
  db = drizzle(client, { schema });
  
  // Create tables if they don't exist
  await client.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id SERIAL PRIMARY KEY,
      player_x VARCHAR(50) NOT NULL,
      player_o VARCHAR(50) NOT NULL,
      winner VARCHAR(50),
      board_state JSONB NOT NULL,
      moves INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);
  
  console.log('✅ Database initialized');
  return { client, db };
}

export async function getDb() {
  if (!db) {
    await initDatabase();
  }
  return db!;
}

export async function getClient() {
  if (!client) {
    await initDatabase();
  }
  return client!;
}
