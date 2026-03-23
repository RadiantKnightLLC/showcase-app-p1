import { pgTable, serial, varchar, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const games = pgTable('games', {
  id: serial('id').primaryKey(),
  playerX: varchar('player_x', { length: 50 }).notNull(),
  playerO: varchar('player_o', { length: 50 }).notNull(),
  winner: varchar('winner', { length: 50 }), // null for draw
  boardState: jsonb('board_state').notNull(), // Array of 9 cells
  moves: integer('moves').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
