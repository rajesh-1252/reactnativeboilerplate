import { useSyncStore } from '@/store/sync';
import NetInfo from '@react-native-community/netinfo';
import { getAppSyncEngine } from './app-sync-engine';
import { createSupabaseBackend } from './supabase';
import { SyncEvent } from './types';

let netInfoUnsubscribe: (() => void) | null = null;

/**
 * Initialize and manage the sync lifecycle
 * This links the SyncEngine events with our Zustand store
 */
export async function initializeSync() {
  const syncStore = useSyncStore.getState();
  const engine = getAppSyncEngine();
  
  // 1. Setup Supabase backend if configured
  const backend = createSupabaseBackend();
  if (backend) {
    engine.setBackend(backend);
  } else {
    console.log('[SyncManager] No Supabase environment variables found. Running offline-only.');
    syncStore.setConnectionState('disconnected');
    return;
  }

  // 2. Setup Real-time Network Monitoring
  if (netInfoUnsubscribe) netInfoUnsubscribe();
  
  netInfoUnsubscribe = NetInfo.addEventListener(state => {
    const isOnline = !!state.isConnected && !!state.isInternetReachable;
    
    // Update engine configuration dynamically
    engine.updateConfig({ enabled: isOnline });
    
    // Update store state for UI feedback
    if (!isOnline) {
      syncStore.setConnectionState('disconnected');
    } else if (engine.connectionState === 'disconnected') {
      // Re-initialize if we just came back online
      engine.initialize().then(() => {
        if (engine.connectionState === 'connected') engine.sync();
      });
    }
  });

  // 3. Subscribe store to engine events
  engine.addEventListener((event: SyncEvent) => {
    // Only log significant events to reduce noise
    if (event.type === 'sync-failed' || (event.type === 'sync-completed' && (event.result.pushedCount > 0 || event.result.pulledCount > 0))) {
        console.log(`[SyncManager] Sync Summary:`, event);
    }

    switch (event.type) {
      case 'connection-changed':
        syncStore.setConnectionState(event.state);
        break;
      
      case 'sync-started':
        syncStore.setSyncing(true);
        syncStore.setError(null);
        break;
      
      case 'sync-completed':
        syncStore.setSyncing(false);
        syncStore.setLastSync(event.result.timestamp, event.result);
        syncStore.setConflictsCount(event.result.conflictCount);
        break;
      
      case 'sync-failed':
        syncStore.setSyncing(false);
        syncStore.setError(event.error.message);
        break;
    }
  });

  // 4. Initial connection/sync
  try {
    await engine.initialize();
    
    if (engine.connectionState === 'connected') {
      await engine.sync();
    }
  } catch (error) {
    console.error('[SyncManager] Initialization failed:', error);
    syncStore.setError(error instanceof Error ? error.message : 'Sync initialization failed');
  }
}

/**
 * Clean up sync engine on app shutdown
 */
export async function shutdownSync() {
  if (netInfoUnsubscribe) {
    netInfoUnsubscribe();
    netInfoUnsubscribe = null;
  }
  const engine = getAppSyncEngine();
  await engine.shutdown();
}
