import { BaseEntity } from '@/db/schema';

/**
 * Sync operation types
 */
export type SyncOperation = 'create' | 'update' | 'delete';

/**
 * Sync direction
 */
export type SyncDirection = 'push' | 'pull';

/**
 * Conflict resolution strategies
 */
export type ConflictStrategy = 
  | 'local-wins'      // Local changes take priority
  | 'remote-wins'     // Remote changes take priority
  | 'last-write-wins' // Most recent updatedAt wins
  | 'manual';         // Require user intervention

/**
 * Represents a change to be synced
 */
export interface SyncChange<T extends BaseEntity = BaseEntity> {
  id: string;
  entity: string;      // Table name
  operation: SyncOperation;
  data: T;
  timestamp: string;   // ISO 8601
}

/**
 * Represents a conflict between local and remote data
 */
export interface SyncConflict<T extends BaseEntity = BaseEntity> {
  id: string;
  entity: string;
  localData: T;
  remoteData: T;
  localTimestamp: string;
  remoteTimestamp: string;
  resolvedAt?: string;
  resolution?: 'local' | 'remote' | 'merged';
}

/**
 * Sync result from a push/pull operation
 */
export interface SyncResult {
  success: boolean;
  pushedCount: number;
  pulledCount: number;
  conflictCount: number;
  errors: SyncError[];
  timestamp: string;
}

/**
 * Sync error details
 */
export interface SyncError {
  id: string;
  entity: string;
  operation: SyncOperation;
  message: string;
  code?: string;
}

/**
 * Connection state for sync engine
 */
export type ConnectionState = 'connected' | 'disconnected' | 'connecting' | 'error';

/**
 * Sync engine configuration
 */
export interface SyncConfig {
  /** Enable/disable sync entirely */
  enabled: boolean;
  /** Auto-sync when app comes online */
  autoSync: boolean;
  /** Sync interval in milliseconds (0 = manual only) */
  syncInterval: number;
  /** Default conflict resolution strategy */
  conflictStrategy: ConflictStrategy;
  /** Tables to sync (empty = all) */
  tables: string[];
  /** Batch size for push/pull operations */
  batchSize: number;
}

/**
 * Default sync configuration
 */
export const DEFAULT_SYNC_CONFIG: SyncConfig = {
  enabled: true,
  autoSync: true,
  syncInterval: 30000, // 30 seconds
  conflictStrategy: 'last-write-wins',
  tables: [],
  batchSize: 50,
};

/**
 * Events emitted by the sync engine
 */
export type SyncEvent =
  | { type: 'sync-started' }
  | { type: 'sync-completed'; result: SyncResult }
  | { type: 'sync-failed'; error: Error }
  | { type: 'conflict-detected'; conflict: SyncConflict }
  | { type: 'connection-changed'; state: ConnectionState }
  | { type: 'push-progress'; current: number; total: number }
  | { type: 'pull-progress'; current: number; total: number };

/**
 * Sync event listener function type
 */
export type SyncEventListener = (event: SyncEvent) => void;
