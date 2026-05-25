import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, DashboardStats } from '../types';
import { ToastType } from '../components';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isDarkMode: boolean;
  isOnboardingDone: boolean;
  stats: DashboardStats | null;
  loading: boolean;
  toast: ToastState;

  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
  setOnboardingDone: (value: boolean) => void;
  setStats: (stats: DashboardStats) => void;
  setLoading: (loading: boolean) => void;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isDarkMode: false,
      isOnboardingDone: false,
      stats: null,
      loading: false,
      toast: { visible: false, message: '', type: 'info' },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDarkMode: (value) => set({ isDarkMode: value }),
      setOnboardingDone: (value) => set({ isOnboardingDone: value }),
      setStats: (stats) => set({ stats }),
      setLoading: (loading) => set({ loading }),
      showToast: (message, type = 'info') => set({ toast: { visible: true, message, type } }),
      hideToast: () => set({ toast: { visible: false, message: '', type: 'info' } }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          stats: null,
        }),
    }),
    {
      name: 'techcontrol-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isDarkMode: state.isDarkMode,
        isOnboardingDone: state.isOnboardingDone,
      }),
    }
  )
);
