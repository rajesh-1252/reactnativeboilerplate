/**
 * Application Architecture Configuration
 * Toggle between Offline-First and Online-First modes
 */

export type ArchitectureMode = "offline-first" | "online-first";

export interface ArchitectureConfig {
  /**
   * The primary mode of the application.
   * 'offline-first': SQLite is the source of truth, synced to remote.
   * 'online-first': Remote API is the source of truth, SQLite is used for caching.
   */
  mode: ArchitectureMode;

  /**
   * Whether to use local cache to show immediate results in online-first mode
   */
  useCache: boolean;
}

export const ARCHITECTURE_CONFIG: ArchitectureConfig = {
  mode: "offline-first", // Change this to 'online-first' for Bumble-like behavior
  useCache: true,
};

/**
 * Helper to check current mode
 */
export const isOnlineFirst = () => ARCHITECTURE_CONFIG.mode === "online-first";
export const isOfflineFirst = () =>
  ARCHITECTURE_CONFIG.mode === "offline-first";
