import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SyncBackend } from './engine';
import { SyncChange, SyncResult } from './types';

/**
 * Supabase sync backend configuration
 */
export interface SupabaseSyncConfig {
  url: string;
  anonKey: string;
  /** Table name for storing sync metadata */
  syncMetaTable?: string;
}

/**
 * Supabase sync backend implementation
 * Actually pushes and pulls data from Supabase
 */
export class SupabaseSyncBackend implements SyncBackend {
  readonly name = 'supabase';
  
  private config: SupabaseSyncConfig;
  private connected = false;
  private lastSyncTime: string | null = null;
  private supabase: SupabaseClient;
  
  constructor(config: SupabaseSyncConfig) {
    this.config = {
      syncMetaTable: '_sync_meta',
      ...config,
    };
    
    // Initialize Supabase client
    this.supabase = createClient(config.url, config.anonKey);
    console.log('[SupabaseSyncBackend] Initialized with URL:', config.url);
  }
  
  async isConnected(): Promise<boolean> {
    return this.connected;
  }
  
  async connect(): Promise<void> {
    console.log('[SupabaseSyncBackend] Connecting...');
    
    try {
      // Basic connectivity check: try to fetch the current user or a metadata row
      // For this boilerplate, we'll just check if we can initialize
      this.connected = true;
      console.log('[SupabaseSyncBackend] Connected');
    } catch (error) {
      console.error('[SupabaseSyncBackend] Connection failed:', error);
      this.connected = false;
      throw error;
    }
  }
  
  async disconnect(): Promise<void> {
    console.log('[SupabaseSyncBackend] Disconnecting...');
    this.connected = false;
  }
  
  async push(changes: SyncChange[]): Promise<SyncResult> {
    console.log('[SupabaseSyncBackend] Pushing', changes.length, 'changes to Supabase');
    let pushedCount = 0;
    const errors: any[] = [];

    for (const change of changes) {
      try {
        if (change.operation === 'delete') {
          const { error } = await this.supabase
            .from(change.entity)
            .delete()
            .eq('id', change.id);
          
          if (error) throw error;
        } else {
          // Upsert handles both 'create' and 'update'
          // We override syncStatus to 'synced' before pushing to record correct state on server
          const dataToPush = { 
            ...change.data, 
            syncStatus: 'synced' 
          };
          
          const { error } = await this.supabase
            .from(change.entity)
            .upsert(dataToPush);
            
          if (error) throw error;
        }
        pushedCount++;
      } catch (error: any) {
        console.error(`[SupabaseSyncBackend] Push error for ${change.entity}:${change.id}`, error);
        errors.push({
          id: change.id,
          entity: change.entity,
          operation: change.operation,
          message: error.message || 'Unknown error',
        });
      }
    }
    
    return {
      success: errors.length === 0,
      pushedCount,
      pulledCount: 0,
      conflictCount: 0,
      errors,
      timestamp: new Date().toISOString(),
    };
  }
  
  async pull(since: string | null): Promise<SyncChange[]> {
    console.log('[SupabaseSyncBackend] Pulling since:', since ?? 'beginning');
    const allChanges: SyncChange[] = [];
    
    // List of tables to sync - in a larger app, this would be dynamic
    const tables = ['items']; 

    for (const table of tables) {
      try {
        let query = this.supabase.from(table).select('*');
        
        if (since) {
          // Use GTE to ensure we don't miss anything that happened at the exact same millisecond
          query = query.gte('updatedAt', since);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data) {
          data.forEach(item => {
            allChanges.push({
              id: item.id,
              entity: table,
              operation: 'update', // Simple implementation: everything is an update
              data: item,
              timestamp: item.updatedAt,
            });
          });
        }
      } catch (error) {
        console.error(`[SupabaseSyncBackend] Pull error for table ${table}:`, error);
      }
    }
    
    return allChanges;
  }
  
  async getLastSyncTime(): Promise<string | null> {
    return this.lastSyncTime;
  }
  
  async setLastSyncTime(timestamp: string): Promise<void> {
    this.lastSyncTime = timestamp;
  }
}

/**
 * Create a Supabase sync backend instance
 * Returns null if Supabase is not configured
 */
export function createSupabaseBackend(): SupabaseSyncBackend | null {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !anonKey) {
    console.log('[Supabase] Not configured - sync disabled');
    return null;
  }
  
  return new SupabaseSyncBackend({ url, anonKey });
}
