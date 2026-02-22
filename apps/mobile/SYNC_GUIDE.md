# Offline-First Sync & Connectivity Guide

This boilerplate implements a robust **Offline-First** architecture. The local database (SQLite) is the single source of truth, and the sync engine works in the background to keep data in parity with Supabase.

## 1. The Architecture

```
┌──────────────┐     ┌─────────────┐     ┌────────────────┐
│    UI        │────▶│   SQLite    │────▶│  Sync Engine   │
│  (React)     │◀────│   (Local)   │◀────│  (Supabase)    │
└──────────────┘     └─────────────┘     └────────────────┘
                            │
                            ▼
                    Source of Truth
```

1. **Write Logic**: All user actions (Add/Edit/Delete) write to SQLite immediately. The UI updates instantly.
2. **Metadata**: Every row has a `syncStatus` ('pending' or 'synced') and a `updatedAt` timestamp.
3. **Background Sync**: Every 30 seconds (configurable), the engine checks for 'pending' items and pushes them to Supabase.

## 2. Setting Up Sync (Supabase)

To enable sync, you must:
1.  **Configure `.env`**: Add your `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
2.  **Database Tables**: Ensure your Supabase tables match the schema in `db/schema.ts` (including camelCase columns like `createdAt`, `updatedAt`, and `syncStatus`). Refer to the SQL snippet in `README.md`.

## 3. Real-Time Online/Offline Status

The app uses native network monitoring via `@react-native-community/netinfo`.

- **Auto-Pause**: If the device loses internet, the sync engine instantly pauses to save battery and prevents failed network requests.
- **UI Indicators**: The `useSyncStatus()` hook provides the `connectionState`. This is used on the Home screen to show "● Online" or "○ Offline".
- **Auto-Resume**: As soon as the connection is restored, the app triggers an immediate sync to push any work you did while offline.

## 4. Conflict Resolution (Last Write Wins)

When data changes on both the client and server while offline, a conflict occurs.
- **The Strategy**: This boilerplate uses **Last-Write-Wins (LWW)**.
- **Logic**: During a sync, we compare the `updatedAt` timestamps. The most recent edit (the largest timestamp) always wins.
- **Where to change**: You can implement custom logic (like field-merging or manual selection) in `sync/conflict.ts`.

## 5. Adding New Syncable Tables

To add a new table to the sync loop:
1.  **Repository**: Create a repository in `db/repository.ts` that handles basic CRUD + `findPending()` and `markSynced()`.
2.  **AppSyncEngine**: In `sync/app-sync-engine.ts`, update `getPendingChanges()` and `applyRemoteChanges()` to include your new entity.
3.  **Supabase**: Ensure the table exists in Supabase with the same columns.

## 6. Testing Offline Scenarios

1. **Testing Delay**: Add an item while online. Notice it says "pending" for a few seconds before switching to "synced". 
2. **Testing Airplane Mode**: Turn on Airplane mode. The status changes to "Offline". Add items. They stay "pending" indefinitely. Turn off Airplane mode; notice they sync automatically after a short delay.
3. **Testing Remote Deletes**: Delete a row in the Supabase Dashboard. Pull-to-refresh on your phone (or wait 30s) and watch it disappear locally.
