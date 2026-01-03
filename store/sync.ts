import { ConnectionState, SyncResult } from '@/sync/types';
import { create } from 'zustand';

/**
 * Sync state store for tracking sync status
 */

interface SyncState {
  // Connection
  connectionState: ConnectionState;
  isOnline: boolean;
  
  // Sync status
  isSyncing: boolean;
  lastSyncTime: string | null;
  lastSyncResult: SyncResult | null;
  
  // Pending changes
  pendingChangesCount: number;
  conflictsCount: number;
  
  // Errors
  lastError: string | null;
  
  // Actions
  setConnectionState: (state: ConnectionState) => void;
  setOnline: (online: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setLastSync: (time: string, result: SyncResult) => void;
  setPendingCount: (count: number) => void;
  setConflictsCount: (count: number) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  connectionState: 'disconnected' as ConnectionState,
  isOnline: true,
  isSyncing: false,
  lastSyncTime: null as string | null,
  lastSyncResult: null as SyncResult | null,
  pendingChangesCount: 0,
  conflictsCount: 0,
  lastError: null as string | null,
};

/**
 * Sync state store using Zustand
 */
export const useSyncStore = create<SyncState>((set) => ({
  ...initialState,

  setConnectionState: (connectionState) => set({ connectionState }),

  setOnline: (isOnline) => set({ isOnline }),

  setSyncing: (isSyncing) => set({ isSyncing }),

  setLastSync: (lastSyncTime, lastSyncResult) =>
    set({ lastSyncTime, lastSyncResult }),

  setPendingCount: (pendingChangesCount) => set({ pendingChangesCount }),

  setConflictsCount: (conflictsCount) => set({ conflictsCount }),

  setError: (lastError) => set({ lastError }),

  reset: () => set(initialState),
}));

/**
 * Hook for sync status UI
 */
export function useSyncStatus() {
  const connectionState = useSyncStore((s) => s.connectionState);
  const isSyncing = useSyncStore((s) => s.isSyncing);
  const lastSyncTime = useSyncStore((s) => s.lastSyncTime);
  const pendingChangesCount = useSyncStore((s) => s.pendingChangesCount);
  const conflictsCount = useSyncStore((s) => s.conflictsCount);

  return {
    connectionState,
    isSyncing,
    lastSyncTime,
    pendingChangesCount,
    conflictsCount,
    hasPendingChanges: pendingChangesCount > 0,
    hasConflicts: conflictsCount > 0,
    isConnected: connectionState === 'connected',
    statusText: getStatusText(connectionState, isSyncing),
  };
}

function getStatusText(state: ConnectionState, isSyncing: boolean): string {
  if (isSyncing) return 'Syncing...';
  
  switch (state) {
    case 'connected':
      return 'Connected';
    case 'connecting':
      return 'Connecting...';
    case 'disconnected':
      return 'Offline';
    case 'error':
      return 'Connection error';
    default:
      return 'Unknown';
  }
}
