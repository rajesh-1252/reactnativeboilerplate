import { create } from 'zustand';

/**
 * Auth state store for managing user authentication
 * This stores session state only - actual auth logic should be in services
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface Session {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

interface AuthState {
  // Auth state
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  
  // Auth actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, session: Session) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const initialState = {
  isAuthenticated: false,
  isLoading: true, // Start as loading until we check persisted auth
  user: null as User | null,
  session: null as Session | null,
};

/**
 * Auth state store using Zustand
 */
export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

  setUser: (user) => set({ user, isAuthenticated: user !== null }),

  setSession: (session) => set({ session }),

  setLoading: (isLoading) => set({ isLoading }),

  login: (user, session) =>
    set({
      user,
      session,
      isAuthenticated: true,
      isLoading: false,
    }),

  logout: () =>
    set({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}));

/**
 * Hook for auth status
 */
export function useAuthStatus() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const user = useAuthStore((s) => s.user);

  return {
    isAuthenticated,
    isLoading,
    user,
    isReady: !isLoading,
  };
}

/**
 * Hook for auth actions
 */
export function useAuthActions() {
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const updateUser = useAuthStore((s) => s.updateUser);

  return { login, logout, updateUser };
}

/**
 * Check if session is expired
 */
export function isSessionExpired(session: Session | null): boolean {
  if (!session) return true;
  return Date.now() >= session.expiresAt;
}
