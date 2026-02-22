import { executeRaw, queryFirst } from './client';
import { SCHEMA } from './schema';

interface MigrationRecord {
  id: number;
  version: number;
  name: string;
  appliedAt: string;
}

interface Migration {
  version: number;
  name: string;
  up: string;
}

/**
 * Migration definitions
 * Add new migrations at the end with incrementing version numbers
 */
const MIGRATIONS: Migration[] = [
  {
    version: 1,
    name: 'initial_schema',
    up: `
      ${SCHEMA.migrations}
      ${SCHEMA.items}
    `,
  },
  // Add future migrations here:
  // {
  //   version: 2,
  //   name: 'add_users_table',
  //   up: `CREATE TABLE IF NOT EXISTS users (...);`,
  // },
];

/**
 * Get the current migration version from the database
 */
async function getCurrentVersion(): Promise<number> {
  try {
    const result = await queryFirst<MigrationRecord>(
      'SELECT version FROM migrations ORDER BY version DESC LIMIT 1'
    );
    return result?.version ?? 0;
  } catch {
    // Table doesn't exist yet
    return 0;
  }
}

/**
 * Record a migration as applied
 */
async function recordMigration(version: number, name: string): Promise<void> {
  await executeRaw(`
    INSERT INTO migrations (version, name, appliedAt)
    VALUES (${version}, '${name}', datetime('now'))
  `);
}

/**
 * Run all pending migrations
 * This should be called after database initialization
 */
export async function runMigrations(): Promise<void> {
  const currentVersion = await getCurrentVersion();
  
  const pendingMigrations = MIGRATIONS.filter(m => m.version > currentVersion);
  
  if (pendingMigrations.length === 0) {
    console.log('[Migrations] Database is up to date');
    return;
  }
  
  console.log(`[Migrations] Running ${pendingMigrations.length} migration(s)...`);
  
  for (const migration of pendingMigrations) {
    console.log(`[Migrations] Applying v${migration.version}: ${migration.name}`);
    
    try {
      await executeRaw(migration.up);
      await recordMigration(migration.version, migration.name);
      console.log(`[Migrations] Successfully applied v${migration.version}`);
    } catch (error) {
      console.error(`[Migrations] Failed to apply v${migration.version}:`, error);
      throw error;
    }
  }
  
  console.log('[Migrations] All migrations complete');
}

/**
 * Get migration status for debugging
 */
export async function getMigrationStatus(): Promise<{
  currentVersion: number;
  pendingCount: number;
  appliedMigrations: MigrationRecord[];
}> {
  const currentVersion = await getCurrentVersion();
  const pendingCount = MIGRATIONS.filter(m => m.version > currentVersion).length;
  
  let appliedMigrations: MigrationRecord[] = [];
  try {
    const { query } = await import('./client');
    appliedMigrations = await query<MigrationRecord>(
      'SELECT * FROM migrations ORDER BY version ASC'
    );
  } catch {
    // Table might not exist
  }
  
  return {
    currentVersion,
    pendingCount,
    appliedMigrations,
  };
}

export { MIGRATIONS };
