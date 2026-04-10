import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const textShares = sqliteTable('text_shares', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  title: text('title'),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  accessCount: integer('access_count').notNull().default(0),
  maxAccess: integer('max_access'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  isEncrypted: integer('is_encrypted', { mode: 'boolean' }).notNull().default(false),
  burnAfterRead: integer('burn_after_read', { mode: 'boolean' }).notNull().default(false),
});
