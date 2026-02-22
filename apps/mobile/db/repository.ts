import * as SQLite from 'expo-sqlite';
import { execute, query, queryFirst } from './client';
import { BaseEntity, SyncStatus, generateId, nowTimestamp } from './schema';

/**
 * Generic repository query options
 */
export interface QueryOptions {
  includeDeleted?: boolean;
  orderBy?: string;
  limit?: number;
  offset?: number;
}

/**
 * Generic CRUD repository for database entities
 * Provides offline-first operations with soft delete and sync status tracking
 */
export class Repository<T extends BaseEntity> {
  constructor(private tableName: string) {}

  /**
   * Get all items from the table
   */
  async findAll(options: QueryOptions = {}): Promise<T[]> {
    const { includeDeleted = false, orderBy = 'createdAt DESC', limit, offset } = options;
    
    let sql = `SELECT * FROM ${this.tableName}`;
    
    if (!includeDeleted) {
      sql += ' WHERE deletedAt IS NULL';
    }
    
    sql += ` ORDER BY ${orderBy}`;
    
    if (limit !== undefined) {
      sql += ` LIMIT ${limit}`;
    }
    
    if (offset !== undefined) {
      sql += ` OFFSET ${offset}`;
    }
    
    return query<T>(sql);
  }

  /**
   * Get a single item by ID
   */
  async findById(id: string, includeDeleted = false): Promise<T | null> {
    let sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    
    if (!includeDeleted) {
      sql += ' AND deletedAt IS NULL';
    }
    
    return queryFirst<T>(sql, [id]);
  }

  /**
   * Get items by a specific field value
   */
  async findBy(field: keyof T, value: unknown, options: QueryOptions = {}): Promise<T[]> {
    const { includeDeleted = false, orderBy = 'createdAt DESC', limit } = options;
    
    let sql = `SELECT * FROM ${this.tableName} WHERE ${String(field)} = ?`;
    
    if (!includeDeleted) {
      sql += ' AND deletedAt IS NULL';
    }
    
    sql += ` ORDER BY ${orderBy}`;
    
    if (limit !== undefined) {
      sql += ` LIMIT ${limit}`;
    }
    
    return query<T>(sql, [value as SQLite.SQLiteBindValue]);
  }

  /**
   * Get all items pending sync
   */
  async findPending(): Promise<T[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE syncStatus = 'pending'
      ORDER BY updatedAt ASC
    `;
    return query<T>(sql);
  }

  /**
   * Get all items with sync conflicts
   */
  async findConflicts(): Promise<T[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE syncStatus = 'conflict'
      ORDER BY updatedAt DESC
    `;
    return query<T>(sql);
  }

  /**
   * Create a new item
   */
  async create(data: Omit<T, keyof BaseEntity>): Promise<T> {
    const now = nowTimestamp();
    const id = generateId();
    
    const item: BaseEntity = {
      id,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      syncStatus: 'pending',
    };
    
    const fullItem = { ...item, ...data } as T;
    
    const columns = Object.keys(fullItem);
    const placeholders = columns.map(() => '?').join(', ');
    const values = columns.map(col => (fullItem as Record<string, unknown>)[col]);
    
    const sql = `
      INSERT INTO ${this.tableName} (${columns.join(', ')})
      VALUES (${placeholders})
    `;
    
    await execute(sql, values as SQLite.SQLiteBindValue[]);
    return fullItem;
  }

  /**
   * Update an existing item
   */
  async update(id: string, data: Partial<Omit<T, keyof BaseEntity>>): Promise<T | null> {
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }
    
    const updates: Record<string, unknown> = {
      ...data,
      updatedAt: nowTimestamp(),
      syncStatus: 'pending' as SyncStatus,
    };
    
    const setClause = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(updates), id];
    
    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    
    await execute(sql, values as SQLite.SQLiteBindValue[]);
    return this.findById(id);
  }

  /**
   * Soft delete an item (sets deletedAt timestamp)
   */
  async delete(id: string): Promise<boolean> {
    const sql = `
      UPDATE ${this.tableName}
      SET deletedAt = ?, updatedAt = ?, syncStatus = 'pending'
      WHERE id = ? AND deletedAt IS NULL
    `;
    
    const now = nowTimestamp();
    const result = await execute(sql, [now, now, id]);
    return result.changes > 0;
  }

  /**
   * Permanently delete an item (use with caution)
   */
  async hardDelete(id: string): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const result = await execute(sql, [id]);
    return result.changes > 0;
  }

  /**
   * Restore a soft-deleted item
   */
  async restore(id: string): Promise<T | null> {
    const sql = `
      UPDATE ${this.tableName}
      SET deletedAt = NULL, updatedAt = ?, syncStatus = 'pending'
      WHERE id = ?
    `;
    
    await execute(sql, [nowTimestamp(), id]);
    return this.findById(id);
  }

  /**
   * Mark an item as synced
   */
  async markSynced(id: string): Promise<void> {
    const sql = `
      UPDATE ${this.tableName}
      SET syncStatus = 'synced'
      WHERE id = ?
    `;
    await execute(sql, [id]);
  }

  /**
   * Mark an item as having a conflict
   */
  async markConflict(id: string): Promise<void> {
    const sql = `
      UPDATE ${this.tableName}
      SET syncStatus = 'conflict'
      WHERE id = ?
    `;
    await execute(sql, [id]);
  }

  /**
   * Get count of items
   */
  async count(includeDeleted = false): Promise<number> {
    let sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    
    if (!includeDeleted) {
      sql += ' WHERE deletedAt IS NULL';
    }
    
    const result = await queryFirst<{ count: number }>(sql);
    return result?.count ?? 0;
  }
}

// Pre-configured repositories
import { Item } from './schema';

export const itemsRepository = new Repository<Item>('items');

export { Repository as BaseRepository };
