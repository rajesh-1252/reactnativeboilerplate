import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

const DATABASE_NAME = 'app.db';

/**
 * Initialize the SQLite database connection
 * This should be called once at app startup
 */
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) {
    return db;
  }
  
  db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  
  // Enable foreign keys and WAL mode for better performance
  await db.execAsync(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
  `);
  
  return db;
}

/**
 * Get the current database instance
 * Throws if database hasn't been initialized
 */
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Close the database connection
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}

/**
 * Execute a raw SQL query (for migrations or complex queries)
 */
export async function executeRaw(sql: string): Promise<void> {
  const database = getDatabase();
  await database.execAsync(sql);
}

/**
 * Run a query and return all results
 */
export async function query<T>(sql: string, params: SQLite.SQLiteBindValue[] = []): Promise<T[]> {
  const database = getDatabase();
  return database.getAllAsync<T>(sql, params);
}

/**
 * Run a query and return the first result
 */
export async function queryFirst<T>(sql: string, params: SQLite.SQLiteBindValue[] = []): Promise<T | null> {
  const database = getDatabase();
  return database.getFirstAsync<T>(sql, params);
}

/**
 * Run an insert/update/delete statement
 */
export async function execute(sql: string, params: SQLite.SQLiteBindValue[] = []): Promise<SQLite.SQLiteRunResult> {
  const database = getDatabase();
  return database.runAsync(sql, params);
}

export { DATABASE_NAME, db };

