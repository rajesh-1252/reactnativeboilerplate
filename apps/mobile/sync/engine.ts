import {
    ConnectionState,
    DEFAULT_SYNC_CONFIG,
    SyncChange,
    SyncConfig,
    SyncEvent,
    SyncEventListener,
    SyncResult,
} from './types';

/**
 * Abstract sync backend interface
 * Implement this interface for different sync providers (Supabase, Firebase, custom API, etc.)
 */
export interface SyncBackend {
  /** Unique identifier for this backend */
  readonly name: string;
  
  /** Check if backend is connected and ready */
  isConnected(): Promise<boolean>;
  
  /** Connect to the backend */
  connect(): Promise<void>;
  
  /** Disconnect from the backend */
  disconnect(): Promise<void>;
  
  /** Push local changes to the remote */
  push(changes: SyncChange[]): Promise<SyncResult>;
  
  /** Pull remote changes to local */
  pull(since: string | null): Promise<SyncChange[]>;
  
  /** Get the last sync timestamp */
  getLastSyncTime(): Promise<string | null>;
  
  /** Store the last sync timestamp */
  setLastSyncTime(timestamp: string): Promise<void>;
}

/**
 * Sync engine orchestrates synchronization between local SQLite and remote backend
 * This is the main entry point for sync operations
 */
export class SyncEngine {
  private backend: SyncBackend | null = null;
  private config: SyncConfig;
  private listeners: Set<SyncEventListener> = new Set();
  private syncInterval: ReturnType<typeof setInterval> | null = null;
  private _connectionState: ConnectionState = 'disconnected';

  constructor(config: Partial<SyncConfig> = {}) {
    this.config = { ...DEFAULT_SYNC_CONFIG, ...config };
  }

  /**
   * Register a sync backend
   */
  setBackend(backend: SyncBackend): void {
    this.backend = backend;
  }

  /**
   * Get current connection state
   */
  get connectionState(): ConnectionState {
    return this._connectionState;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Restart interval if needed
    if (this.syncInterval) {
      this.stopAutoSync();
      if (this.config.autoSync) {
        this.startAutoSync();
      }
    }
  }

  /**
   * Add event listener
   */
  addEventListener(listener: SyncEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Emit event to all listeners
   */
  private emit(event: SyncEvent): void {
    this.listeners.forEach(listener => listener(event));
  }

  /**
   * Update connection state
   */
  private setConnectionState(state: ConnectionState): void {
    if (this._connectionState !== state) {
      this._connectionState = state;
      this.emit({ type: 'connection-changed', state });
    }
  }

  /**
   * Initialize the sync engine
   */
  async initialize(): Promise<void> {
    if (!this.config.enabled || !this.backend) {
      console.log('[SyncEngine] Sync disabled or no backend configured');
      return;
    }

    try {
      this.setConnectionState('connecting');
      await this.backend.connect();
      this.setConnectionState('connected');
      
      if (this.config.autoSync && this.config.syncInterval > 0) {
        this.startAutoSync();
      }
    } catch (error) {
      console.error('[SyncEngine] Failed to initialize:', error);
      this.setConnectionState('error');
    }
  }

  /**
   * Start automatic sync interval
   */
  startAutoSync(): void {
    if (this.syncInterval) {
      return;
    }

    this.syncInterval = setInterval(() => {
      this.sync().catch(console.error);
    }, this.config.syncInterval);
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Perform full sync (push then pull)
   */
  async sync(): Promise<SyncResult> {
    if (!this.backend) {
      throw new Error('No sync backend configured');
    }

    if (!this.config.enabled) {
      return {
        success: false,
        pushedCount: 0,
        pulledCount: 0,
        conflictCount: 0,
        errors: [{ id: 'disabled', entity: '', operation: 'update', message: 'Sync is disabled' }],
        timestamp: new Date().toISOString(),
      };
    }

    this.emit({ type: 'sync-started' });

    try {
      // Get pending changes from local database
      const localChanges = await this.getPendingChanges();
      
      // Push local changes to remote
      let pushResult: SyncResult = {
        success: true,
        pushedCount: 0,
        pulledCount: 0,
        conflictCount: 0,
        errors: [],
        timestamp: new Date().toISOString(),
      };
      
      if (localChanges.length > 0) {
        pushResult = await this.backend.push(localChanges);
        
        // Mark successfully pushed changes as synced
        if (pushResult.success) {
          const syncedIds = localChanges
            .filter(c => !pushResult.errors.some(e => e.id === c.id))
            .map(c => ({ id: c.id, entity: c.entity }));
          await this.markChangesSynced(syncedIds);
        }
        
        this.emit({ type: 'push-progress', current: localChanges.length, total: localChanges.length });
      }
      
      // Pull remote changes
      const lastSync = await this.backend.getLastSyncTime();
      const remoteChanges = await this.backend.pull(lastSync);
      
      let pullCount = 0;
      if (remoteChanges.length > 0) {
        pullCount = await this.applyRemoteChanges(remoteChanges);
        this.emit({ type: 'pull-progress', current: pullCount, total: remoteChanges.length });
      }
      
      // Update last sync time
      const now = new Date().toISOString();
      await this.backend.setLastSyncTime(now);
      
      const result: SyncResult = {
        success: pushResult.success,
        pushedCount: pushResult.pushedCount,
        pulledCount: pullCount,
        conflictCount: pushResult.conflictCount,
        errors: [...pushResult.errors],
        timestamp: now,
      };
      
      this.emit({ type: 'sync-completed', result });
      return result;
      
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.emit({ type: 'sync-failed', error: err });
      throw error;
    }
  }

  /**
   * Get pending changes from local database
   * Override this in subclass to implement actual logic
   */
  protected async getPendingChanges(): Promise<SyncChange[]> {
    // This should be implemented to query all tables with syncStatus = 'pending'
    // For now, returning empty array as scaffold
    console.log('[SyncEngine] getPendingChanges - implement in consuming app');
    return [];
  }

  /**
   * Mark local changes as synced in the database
   * Override this in subclass
   */
  protected async markChangesSynced(changes: { id: string; entity: string }[]): Promise<void> {
    console.log('[SyncEngine] markChangesSynced - implement in consuming app', changes.length);
  }

  /**
   * Apply remote changes to local database
   * Override this in subclass to implement actual logic
   */
  protected async applyRemoteChanges(changes: SyncChange[]): Promise<number> {
    // This should be implemented to apply changes and handle conflicts
    // For now, returning 0 as scaffold
    console.log('[SyncEngine] applyRemoteChanges - implement in consuming app', changes.length);
    return 0;
  }

  /**
   * Shutdown the sync engine
   */
  async shutdown(): Promise<void> {
    this.stopAutoSync();
    
    if (this.backend) {
      await this.backend.disconnect();
    }
    
    this.setConnectionState('disconnected');
    this.listeners.clear();
  }
}

// Singleton instance
let syncEngineInstance: SyncEngine | null = null;

/**
 * Get the global sync engine instance
 */
export function getSyncEngine(): SyncEngine {
  if (!syncEngineInstance) {
    syncEngineInstance = new SyncEngine();
  }
  return syncEngineInstance;
}

/**
 * Initialize sync engine with custom config
 */
export function initSyncEngine(config?: Partial<SyncConfig>): SyncEngine {
  syncEngineInstance = new SyncEngine(config);
  return syncEngineInstance;
}

export { SyncEngine as default };
