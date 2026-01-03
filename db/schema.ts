/**
 * Base entity interface for all database models
 * Includes common fields for offline-first sync architecture
 */
export interface BaseEntity {
  id: string;
  createdAt: string;   // ISO 8601 timestamp
  updatedAt: string;   // ISO 8601 timestamp
  deletedAt: string | null;  // Soft delete timestamp (null = not deleted)
  syncStatus: SyncStatus;
}

/**
 * Sync status for tracking local changes
 */
export type SyncStatus = 'synced' | 'pending' | 'conflict';

/**
 * Example Item entity demonstrating schema patterns
 */
export interface Item extends BaseEntity {
  title: string;
  content: string;
  priority: number;
}

/**
 * SQL schema definitions
 * Each table includes standard fields for offline-first sync
 */
export const SCHEMA = {
  // Migrations tracking table
  migrations: `
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER NOT NULL UNIQUE,
      name TEXT NOT NULL,
      appliedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `,
  
  // Example items table
  items: `
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      priority INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
      deletedAt TEXT DEFAULT NULL,
      syncStatus TEXT NOT NULL DEFAULT 'pending' CHECK(syncStatus IN ('synced', 'pending', 'conflict'))
    );
    
    CREATE INDEX IF NOT EXISTS idx_items_syncStatus ON items(syncStatus);
    CREATE INDEX IF NOT EXISTS idx_items_deletedAt ON items(deletedAt);
    CREATE INDEX IF NOT EXISTS idx_items_updatedAt ON items(updatedAt);
  `,
} as const;

/**
 * Input type for creating new items (auto-generated fields omitted)
 */
export type CreateItemInput = Pick<Item, 'title' | 'content'> & Partial<Pick<Item, 'priority'>>;

/**
 * Input type for updating existing items
 */
export type UpdateItemInput = Partial<Pick<Item, 'title' | 'content' | 'priority'>>;

/**
 * Generate a UUID v4 for entity IDs
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get current ISO timestamp
 */
export function nowTimestamp(): string {
  return new Date().toISOString();
}
