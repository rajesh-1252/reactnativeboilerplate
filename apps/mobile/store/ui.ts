import { create } from 'zustand';

/**
 * UI state store for managing transient UI state
 * This should NOT contain business data - only UI concerns
 */

export interface Toast {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
}

export interface Modal {
  id: string;
  visible: boolean;
  data?: unknown;
}

interface UIState {
  // Loading states
  isLoading: boolean;
  loadingMessage: string | null;
  
  // Toasts
  toasts: Toast[];
  
  // Modals
  modals: Record<string, Modal>;
  
  // Navigation
  activeTab: string;
  
  // Search/filters
  searchQuery: string;
  
  // Actions
  setLoading: (loading: boolean, message?: string | null) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  openModal: (id: string, data?: unknown) => void;
  closeModal: (id: string) => void;
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
}

const initialState = {
  isLoading: false,
  loadingMessage: null,
  toasts: [] as Toast[],
  modals: {} as Record<string, Modal>,
  activeTab: 'home',
  searchQuery: '',
};

/**
 * UI state store using Zustand
 */
export const useUIStore = create<UIState>((set) => ({
  ...initialState,

  setLoading: (loading, message = null) =>
    set({ isLoading: loading, loadingMessage: message }),

  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: `toast-${Date.now()}-${Math.random().toString(36).slice(2)}` },
      ],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),

  openModal: (id, data) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: { id, visible: true, data },
      },
    })),

  closeModal: (id) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: { ...state.modals[id], visible: false },
      },
    })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  reset: () => set(initialState),
}));

/**
 * Hook to check if a modal is open
 */
export function useModal(id: string) {
  const modal = useUIStore((state) => state.modals[id]);
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);

  return {
    isOpen: modal?.visible ?? false,
    data: modal?.data,
    open: (data?: unknown) => openModal(id, data),
    close: () => closeModal(id),
  };
}

/**
 * Hook to show toasts
 */
export function useToast() {
  const addToast = useUIStore((state) => state.addToast);
  const removeToast = useUIStore((state) => state.removeToast);

  return {
    show: (message: string, type: Toast['type'] = 'info', duration = 3000) => {
      const toast = { message, type, duration };
      addToast(toast);
    },
    success: (message: string) => addToast({ message, type: 'success', duration: 3000 }),
    error: (message: string) => addToast({ message, type: 'error', duration: 5000 }),
    warning: (message: string) => addToast({ message, type: 'warning', duration: 4000 }),
    info: (message: string) => addToast({ message, type: 'info', duration: 3000 }),
    dismiss: removeToast,
  };
}
