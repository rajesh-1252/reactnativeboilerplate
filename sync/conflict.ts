import { BaseEntity } from '@/db/schema';
import { ConflictStrategy, SyncConflict } from './types';

/**
 * Conflict resolver interface
 * Implement custom resolvers for specific conflict handling needs
 */
export interface ConflictResolver<T extends BaseEntity = BaseEntity> {
  /** Resolve a conflict and return the winning data */
  resolve(conflict: SyncConflict<T>): Promise<T>;
}

/**
 * Last-write-wins resolver
 * Compares timestamps and uses the most recent version
 */
export class LastWriteWinsResolver<T extends BaseEntity> implements ConflictResolver<T> {
  async resolve(conflict: SyncConflict<T>): Promise<T> {
    const localTime = new Date(conflict.localTimestamp).getTime();
    const remoteTime = new Date(conflict.remoteTimestamp).getTime();
    
    return localTime >= remoteTime ? conflict.localData : conflict.remoteData;
  }
}

/**
 * Local-wins resolver
 * Always prefers local changes
 */
export class LocalWinsResolver<T extends BaseEntity> implements ConflictResolver<T> {
  async resolve(conflict: SyncConflict<T>): Promise<T> {
    return conflict.localData;
  }
}

/**
 * Remote-wins resolver
 * Always prefers remote changes
 */
export class RemoteWinsResolver<T extends BaseEntity> implements ConflictResolver<T> {
  async resolve(conflict: SyncConflict<T>): Promise<T> {
    return conflict.remoteData;
  }
}

/**
 * Field-level merge resolver
 * Merges non-conflicting fields, uses strategy for conflicts
 */
export class FieldMergeResolver<T extends BaseEntity> implements ConflictResolver<T> {
  constructor(
    private fallbackStrategy: ConflictStrategy = 'last-write-wins',
    private mergeableFields: (keyof T)[] = []
  ) {}

  async resolve(conflict: SyncConflict<T>): Promise<T> {
    const merged = { ...conflict.localData };
    const localTime = new Date(conflict.localTimestamp).getTime();
    const remoteTime = new Date(conflict.remoteTimestamp).getTime();
    
    // For each field, determine which version to use
    for (const key of Object.keys(conflict.remoteData) as (keyof T)[]) {
      // Skip base entity fields
      if (['id', 'createdAt', 'syncStatus'].includes(key as string)) {
        continue;
      }
      
      const localValue = conflict.localData[key];
      const remoteValue = conflict.remoteData[key];
      
      // If values are the same, no conflict
      if (JSON.stringify(localValue) === JSON.stringify(remoteValue)) {
        continue;
      }
      
      // If field is mergeable and exists in both, keep local
      if (this.mergeableFields.includes(key)) {
        // Could implement more complex merging logic here
        merged[key] = localValue;
        continue;
      }
      
      // Apply fallback strategy
      switch (this.fallbackStrategy) {
        case 'local-wins':
          merged[key] = localValue;
          break;
        case 'remote-wins':
          merged[key] = remoteValue;
          break;
        case 'last-write-wins':
        default:
          merged[key] = localTime >= remoteTime ? localValue : remoteValue;
      }
    }
    
    // Update timestamp to now
    merged.updatedAt = new Date().toISOString();
    
    return merged;
  }
}

/**
 * Create a resolver based on strategy
 */
export function createResolver<T extends BaseEntity>(
  strategy: ConflictStrategy
): ConflictResolver<T> {
  switch (strategy) {
    case 'local-wins':
      return new LocalWinsResolver<T>();
    case 'remote-wins':
      return new RemoteWinsResolver<T>();
    case 'last-write-wins':
    default:
      return new LastWriteWinsResolver<T>();
  }
}

/**
 * Conflict queue for manual resolution
 */
export class ConflictQueue<T extends BaseEntity = BaseEntity> {
  private conflicts: Map<string, SyncConflict<T>> = new Map();
  
  /**
   * Add a conflict to the queue
   */
  add(conflict: SyncConflict<T>): void {
    this.conflicts.set(conflict.id, conflict);
  }
  
  /**
   * Get all pending conflicts
   */
  getAll(): SyncConflict<T>[] {
    return Array.from(this.conflicts.values());
  }
  
  /**
   * Get a specific conflict by ID
   */
  get(id: string): SyncConflict<T> | undefined {
    return this.conflicts.get(id);
  }
  
  /**
   * Check if there are any conflicts
   */
  hasConflicts(): boolean {
    return this.conflicts.size > 0;
  }
  
  /**
   * Get conflict count
   */
  get count(): number {
    return this.conflicts.size;
  }
  
  /**
   * Resolve a conflict with chosen data
   */
  resolve(id: string, resolution: 'local' | 'remote', resolvedData: T): T {
    const conflict = this.conflicts.get(id);
    if (!conflict) {
      throw new Error(`Conflict ${id} not found`);
    }
    
    conflict.resolution = resolution;
    conflict.resolvedAt = new Date().toISOString();
    this.conflicts.delete(id);
    
    return resolvedData;
  }
  
  /**
   * Clear all conflicts
   */
  clear(): void {
    this.conflicts.clear();
  }
}

// Global conflict queue
export const conflictQueue = new ConflictQueue();
