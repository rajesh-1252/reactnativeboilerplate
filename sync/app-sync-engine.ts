import { execute } from '@/db/client';
import { itemsRepository } from '@/db/repository';
import { Item } from '@/db/schema';
import { LastWriteWinsResolver } from './conflict';
import { SyncEngine } from './engine';
import { SyncChange, SyncConfig } from './types';

/**
 * Concrete implementation of the SyncEngine for this application
 * This handles the specific SQLite tables and their mappings to the sync backend
 */
export class AppSyncEngine extends SyncEngine {
  private itemResolver = new LastWriteWinsResolver<Item>();

  constructor(config: Partial<SyncConfig> = {}) {
    super(config);
  }

  /**
   * Gather all local changes that need to be pushed to Supabase
   */
  protected async getPendingChanges(): Promise<SyncChange[]> {
    const changes: SyncChange[] = [];
    
    // 1. Get pending items
    const pendingItems = await itemsRepository.findPending();
    
    for (const item of pendingItems) {
      changes.push({
        id: item.id,
        entity: 'items',
        operation: item.deletedAt ? 'delete' : 'update',
        data: item,
        timestamp: item.updatedAt,
      });
    }
    
    if (changes.length > 0) {
      console.log(`[AppSyncEngine] Found ${changes.length} pending changes to push`);
    }
    return changes;
  }

  /**
   * Mark local changes as successfully synced
   */
  protected async markChangesSynced(changes: { id: string; entity: string }[]): Promise<void> {
    for (const change of changes) {
      if (change.entity === 'items') {
        await itemsRepository.markSynced(change.id);
      }
    }
    if (changes.length > 0) {
       console.log(`[AppSyncEngine] Marked ${changes.length} changes as synced in local DB`);
    }
  }

  /**
   * Apply changes received from the Supabase backend to the local SQLite database
   * Uses LastWriteWinsResolver to handle potential conflicts
   */
  protected async applyRemoteChanges(changes: SyncChange[]): Promise<number> {
    let appliedCount = 0;
    
    for (const change of changes) {
      try {
        if (change.entity === 'items') {
          const remoteItem = change.data as Item;
          
          if (change.operation === 'delete' || remoteItem.deletedAt) {
            await itemsRepository.hardDelete(remoteItem.id);
            appliedCount++;
            continue;
          }

          // Check for local conflict
          const localItem = await itemsRepository.findById(remoteItem.id, true);
          
          let itemToSave = remoteItem;
          
          if (localItem && localItem.syncStatus === 'pending') {
            // Conflict detected!
            itemToSave = await this.itemResolver.resolve({
              id: remoteItem.id,
              entity: 'items',
              localData: localItem,
              remoteData: remoteItem,
              localTimestamp: localItem.updatedAt,
              remoteTimestamp: remoteItem.updatedAt,
            });
            console.log(`[AppSyncEngine] Conflict resolved for ${remoteItem.id} using LastWriteWins`);
          }
          
          // Upsert logic
          const columns = Object.keys(itemToSave);
          const placeholders = columns.map(() => '?').join(', ');
          const values = columns.map(col => (itemToSave as any)[col]);
          
          // Reset syncStatus to 'synced' for data coming from/resolved with server
          const syncStatusIdx = columns.indexOf('syncStatus');
          if (syncStatusIdx !== -1) {
            values[syncStatusIdx] = 'synced';
          }
          
          const sql = `
            INSERT OR REPLACE INTO items (${columns.join(', ')})
            VALUES (${placeholders})
          `;
          
          await execute(sql, values);
          appliedCount++;
        }
      } catch (error) {
        console.error(`[AppSyncEngine] Failed to apply remote change for ${change.entity}:${change.id}`, error);
      }
    }
    
    return appliedCount;
  }
}

// Update the global instance handler to use AppSyncEngine
let appSyncEngineInstance: AppSyncEngine | null = null;

export function getAppSyncEngine(): AppSyncEngine {
  if (!appSyncEngineInstance) {
    appSyncEngineInstance = new AppSyncEngine();
  }
  return appSyncEngineInstance;
}
